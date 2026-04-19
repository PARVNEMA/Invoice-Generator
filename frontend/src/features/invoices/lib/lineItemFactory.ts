import type { InvoiceLineItemForm } from '../types';

export const createEmptyLineItem = (): InvoiceLineItemForm => ({
  selectedItemId: undefined,
  itemName: '',
  variantDescription: '',
  basePrice: 0,
  quantity: 1,
  gstPercent: 5,
  discountType: 'percent',
  discountValue: 0,
});
