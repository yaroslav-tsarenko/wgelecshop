export const COMPANY = {
  legalName: "AVONTRA LTD",
  tradingName: "WGELECSHOP",
  companyNumber: "17245887",
  street: "Dept 6735, 196 High Road",
  city: "Wood Green, London",
  postalCode: "N22 8HH",
  country: "United Kingdom",
  director: "Helen CHAMPION",
  phone: "+44 7360 545980",
  phoneHref: "tel:+447360545980",
  email: "info@wgelecshop.com",
} as const;

export const COMPANY_ADDRESS = `${COMPANY.street}, ${COMPANY.city}, ${COMPANY.country}, ${COMPANY.postalCode}`;
