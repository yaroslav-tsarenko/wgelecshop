import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators/checkout";
import { getSessionUser } from "@/lib/auth";
import { sendOrderConfirmationEmail, sendOrderInvoiceEmail } from "@/lib/email";
import { scheduleEmail } from "@/lib/email-jobs";
import { resolveDiscount, markDiscountUsed } from "@/lib/discounts";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    const body = await request.json();
    const validated = checkoutSchema.parse(body);
    const { items, locale } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!validated.contact.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = items.map((item: { productId: string; quantity: number; variantName?: string }) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        variantName: item.variantName || null,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      };
    });

    const discount = await resolveDiscount({
      userId: user?.id ?? null,
      email: validated.contact.email,
      code: validated.discountCode ?? null,
    });

    const discountAmount = discount ? +(subtotal * (discount.percent / 100)).toFixed(2) : 0;
    const discountedSubtotal = subtotal - discountAmount;

    const settings = await prisma.storeSettings.findFirst();
    const baseCurrency = settings?.currency || "EUR";
    const currencyCookie = request.cookies.get("currency")?.value;
    const selectedCurrency = (body.currency && ["EUR", "USD", "GBP"].includes(body.currency))
      ? body.currency
      : ((currencyCookie && ["EUR", "USD", "GBP"].includes(currencyCookie))
        ? currencyCookie
        : baseCurrency);

    const taxRate = Number(settings?.taxRate ?? 21);
    const taxAmount = +(discountedSubtotal * (taxRate / 100)).toFixed(2);
    const shippingCost = discountedSubtotal >= Number(settings?.freeShippingMin ?? 100) ? 0 : 5.99;
    const total = +(discountedSubtotal + taxAmount + shippingCost).toFixed(2);

    // Convert total to the selected currency for Oppwa
    let totalInSelectedCurrency = total;
    let rates = { EUR: 1, USD: 1.08, GBP: 0.85 };
    if (selectedCurrency !== "EUR") {
      try {
        const res = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,GBP");
        if (res.ok) {
          const data = await res.json();
          rates = { EUR: 1, USD: data.rates.USD, GBP: data.rates.GBP };
        }
      } catch (e) {
        console.warn("Failed to fetch exchange rates, using fallback:", e);
      }
      const rate = rates[selectedCurrency as keyof typeof rates] || 1;
      totalInSelectedCurrency = total * rate;
    }

    const order = await prisma.order.create({
      data: {
        user: user?.id ? { connect: { id: user.id } } : undefined,
        customerName: `${validated.shipping.firstName} ${validated.shipping.lastName}`,
        customerEmail: validated.contact.email,
        customerPhone: validated.contact.phone,
        shippingAddress: validated.shipping,
        shippingMethod: validated.shippingMethod,
        shippingCost,
        subtotal,
        taxAmount,
        discountAmount,
        discountCode: discount?.code ?? null,
        discountPercent: discount?.percent ?? null,
        total,
        paymentMethod: "paybylink",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    if (discount) {
      await markDiscountUsed(discount, user?.id ?? null);
    }

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    // ProcX HPP Endpoint
    const isLive = process.env.PROCX_LIVE === "true";
    const procxEndpoint = isLive
      ? "https://api.prmpg.com/payment/checkout"
      : "https://api-sandbox.prmpg.com/payment/checkout";

    // Build Redirect URLs ensuring https:// prefix
    const reqHost = request.headers.get("host");
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (reqHost ? `https://${reqHost}` : "https://www.wgelecshop.com");
    if (siteUrl.startsWith("http://")) {
      siteUrl = siteUrl.replace("http://", "https://");
    }
    siteUrl = siteUrl.replace(/\/+$/, "");

    const localizedPath = locale ? `/${locale}/order/confirmed` : "/order/confirmed";
    const redirectBase = `${siteUrl}${localizedPath}`;

    const acceptUrl    = `${redirectBase}?status=accept&orderId=${order.id}`;
    const declineUrl   = `${redirectBase}?status=decline&orderId=${order.id}`;
    const pendingUrl   = `${redirectBase}?status=pending&orderId=${order.id}`;
    const exceptionUrl = `${redirectBase}?status=exception&orderId=${order.id}`;
    const cancelUrl    = `${redirectBase}?status=cancel&orderId=${order.id}`;

    const userAgent = request.headers.get("user-agent") || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "1.2.3.4";

    const procxPayload = {
      type: "hosted_page",
      locale: locale ? `${locale.toLowerCase()}_${locale.toUpperCase()}` : "en_EN",
      operation_type: "direct_capture",
      amount: Number(totalInSelectedCurrency.toFixed(2)),
      currency: selectedCurrency,
      token_type: "oneshot",
      payment_channel: "e-commerce",
      order_merchant_id: order.orderNumber,
      customer_first_name: validated.shipping.firstName,
      customer_last_name: validated.shipping.lastName,
      customer_street_name: validated.shipping.address1,
      customer_city: validated.shipping.city,
      customer_country: validated.shipping.country || "LV",
      customer_zip_code: validated.shipping.postalCode,
      customer_email: validated.contact.email,
      customer_ip: clientIp,
      accept_url: acceptUrl,
      decline_url: declineUrl,
      pending_url: pendingUrl,
      exception_url: exceptionUrl,
      cancel_url: cancelUrl,
      customer_browser_info_color_depth: 24,
      customer_browser_info_accept_header: "*/*",
      customer_browser_info_java_enabled: false,
      customer_browser_info_js_enabled: true,
      customer_browser_info_screen_height: 1080,
      customer_browser_info_screen_width: 1920,
      customer_browser_info_time_zone: "Europe/Riga",
      customer_browser_info_language: "en-US",
      customer_browser_info_user_agent: userAgent,
    };

    console.log("ProcX HPP Request Endpoint:", procxEndpoint);
    console.log("ProcX HPP Request Payload:", JSON.stringify(procxPayload));

    const response = await fetch(procxEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PROCX_PRIVATE_KEY || "",
      },
      body: JSON.stringify(procxPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ProcX HPP API error status:", response.status, "body:", errorText);
      throw new Error(`Failed to generate ProcX payment link: ${errorText}`);
    }

    const procxData = await response.json();
    console.log("ProcX HPP Response Data:", JSON.stringify(procxData));

    const checkoutId = procxData.checkout?.checkout_id || procxData.checkout_id || null;
    const redirectUrl = procxData.redirect_url;

    if (!redirectUrl) {
      throw new Error(`ProcX did not return a valid redirect_url: ${JSON.stringify(procxData)}`);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: checkoutId || order.id,
      },
      include: { items: true },
    });

    return NextResponse.json({ ...updatedOrder, paymentLink: redirectUrl }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({
      error: "Failed to create order",
      details: error.message || String(error),
      stack: error.stack
    }, { status: 500 });
  }
}
