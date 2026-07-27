import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendOrderInvoiceEmail } from "@/lib/email";
import { scheduleEmail } from "@/lib/email-jobs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const checkoutId = searchParams.get("checkoutId") || searchParams.get("paymentLinkId");
    const statusParam = searchParams.get("status")?.toLowerCase() || "accept";

    if (!orderId && !checkoutId) {
      return NextResponse.json(
        { error: "orderId or checkoutId is required" },
        { status: 400 }
      );
    }

    const whereConditions: any[] = [];
    if (orderId) whereConditions.push({ id: orderId });
    if (checkoutId) whereConditions.push({ paymentId: checkoutId });

    const order = await prisma.order.findFirst({
      where: { OR: whereConditions },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If order is already paid, return it immediately to avoid duplicate processing
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(order);
    }

    const isSuccess = statusParam === "accept";
    const isPending = statusParam === "pending";

    if (isSuccess) {
      const paidAmount = Number(order.total);
      const paidCurrency = "EUR";

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
        },
        include: { items: true },
      });

      // Send order to Horolska Hub Webhook
      const hubToken = process.env.HOROLSKA_HUB_TOKEN;
      if (hubToken) {
        const shipping = (updatedOrder.shippingAddress as any) || {};
        const hubPayload = {
          site_name: "WGELECSHOP",
          site_url: "https://www.wgelecshop.com/",
          order_id: updatedOrder.id,
          admin_url: "",
          billing: {
            first_name: shipping.firstName || "",
            last_name: shipping.lastName || "",
            email: updatedOrder.customerEmail || "",
            phone: updatedOrder.customerPhone || "",
            address_1: shipping.address1 || "",
            address_2: shipping.address2 || "",
            city: shipping.city || "",
            state: shipping.province || "",
            postcode: shipping.postalCode || "",
            country: shipping.country || "",
          },
          items: updatedOrder.items.map((item) => ({
            name: item.productName,
            qty: item.quantity,
            price: Number(item.price),
            total: Number(item.total),
          })),
          total: paidAmount,
          currency: paidCurrency,
        };

        console.log("Sending order webhook to Horolska Hub from ProcX verify route...");
        fetch("https://hub.horolska.lv/api/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${hubToken}`,
          },
          body: JSON.stringify(hubPayload),
        })
          .then(async (res) => {
            if (!res.ok) {
              const errText = await res.text();
              console.error("Horolska Hub webhook failed in verify:", res.status, errText);
            } else {
              console.log("Horolska Hub webhook sent successfully in verify");
            }
          })
          .catch((err) => {
            console.error("Error sending Horolska Hub webhook in verify:", err);
          });
      }

      // Send confirmation & invoice emails
      const emailPayload = {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        items: updatedOrder.items,
        subtotal: updatedOrder.subtotal,
        taxAmount: updatedOrder.taxAmount,
        shippingCost: updatedOrder.shippingCost,
        discountAmount: updatedOrder.discountAmount,
        total: updatedOrder.total,
        shippingMethod: updatedOrder.shippingMethod || "standard",
        shippingAddress: updatedOrder.shippingAddress as any,
        createdAt: updatedOrder.createdAt,
      };

      scheduleEmail(`order confirmation ${updatedOrder.orderNumber}`, () => sendOrderConfirmationEmail(emailPayload));
      scheduleEmail(`order invoice ${updatedOrder.orderNumber}`, () => sendOrderInvoiceEmail(emailPayload));

      return NextResponse.json(updatedOrder);
    } else if (isPending) {
      return NextResponse.json(order);
    } else {
      // status is decline, cancel, or exception
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
        },
        include: { items: true },
      });
      return NextResponse.json(updatedOrder);
    }
  } catch (error) {
    console.error("Error verifying ProcX order payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
