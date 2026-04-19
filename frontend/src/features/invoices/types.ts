export type DiscountType = 'percent' | 'absolute';

export type GstPercent = 5 | 12 | 18;

export type InvoiceLineItemForm = {
  selectedItemId?: string;
  itemName: string;
  variantDescription?: string;
  basePrice: number;
  quantity: number;
  gstPercent: GstPercent;
  discountType: DiscountType;
  discountValue: number;
};

export type InvoiceFormValues = {
  customerName: string;
  phone: string;
  email: string;
  billingAddress: string;
  lineItems: InvoiceLineItemForm[];
};

export type InvoiceLineItemPayload = {
  itemId?: string;
  itemName: string;
  variantDescription?: string;
  basePrice: number;
  quantity: number;
  gstPercent: GstPercent;
  discountType: DiscountType;
  discountValue: number;
};

export type CreateInvoicePayload = {
  customerName: string;
  phone: string;
  email: string;
  billingAddress: string;
  lineItems: InvoiceLineItemPayload[];
};

export type CreatedInvoice = {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  totalDiscount: number;
  totalGST: number;
  grandTotal: number;
};
