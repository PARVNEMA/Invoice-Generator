import type { InvoiceLineItemForm } from '../types';

export type LineTotals = {
  subtotalBeforeDiscount: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  gstAmount: number;
  rowTotal: number;
};

export type InvoiceTotals = {
  subtotal: number;
  totalDiscount: number;
  totalGST: number;
  grandTotal: number;
};

const round2 = (value: number) => Number(value.toFixed(2));

export function calculateLineTotals(line: InvoiceLineItemForm): LineTotals {
  const basePrice = Number(line.basePrice) || 0;
  const quantity = Number(line.quantity) || 0;
  const discountValue = Number(line.discountValue) || 0;
  const gstPercent = Number(line.gstPercent) || 0;

  const subtotalBeforeDiscount = basePrice * quantity;
  const discountAmount =
    line.discountType === 'percent'
      ? (subtotalBeforeDiscount * discountValue) / 100
      : discountValue;
  const boundedDiscount = Math.min(discountAmount, subtotalBeforeDiscount);
  const subtotalAfterDiscount = Math.max(0, subtotalBeforeDiscount - boundedDiscount);
  const gstAmount = (subtotalAfterDiscount * gstPercent) / 100;
  const rowTotal = subtotalAfterDiscount + gstAmount;

  return {
    subtotalBeforeDiscount: round2(subtotalBeforeDiscount),
    discountAmount: round2(boundedDiscount),
    subtotalAfterDiscount: round2(subtotalAfterDiscount),
    gstAmount: round2(gstAmount),
    rowTotal: round2(rowTotal),
  };
}

export function calculateInvoiceTotals(lines: InvoiceLineItemForm[]): InvoiceTotals {
  const totals = lines.reduce(
    (acc, line) => {
      const lineTotals = calculateLineTotals(line);
      acc.subtotal += lineTotals.subtotalBeforeDiscount;
      acc.totalDiscount += lineTotals.discountAmount;
      acc.totalGST += lineTotals.gstAmount;
      acc.grandTotal += lineTotals.rowTotal;
      return acc;
    },
    { subtotal: 0, totalDiscount: 0, totalGST: 0, grandTotal: 0 },
  );

  return {
    subtotal: round2(totals.subtotal),
    totalDiscount: round2(totals.totalDiscount),
    totalGST: round2(totals.totalGST),
    grandTotal: round2(totals.grandTotal),
  };
}
