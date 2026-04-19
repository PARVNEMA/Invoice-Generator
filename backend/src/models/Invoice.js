// models/Invoice.js
const mongoose = require('mongoose');


// Why snapshot itemName and basePrice in the lineItem? If someone edits an item later, old invoices should still show the original values — same reason real invoices work this way.

const lineItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  itemName: { type: String, required: true },      // snapshot at time of invoice
  variantDescription: { type: String },
  basePrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  gstPercent: { type: Number, required: true },    // 5, 12, or 18
  discountType: { type: String, enum: ['percent', 'absolute'], default: 'percent' },
  discountValue: { type: Number, default: 0 },
  rowTotal: { type: Number, required: true },      // calculated & stored
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },   // auto-generated e.g. INV-2026-0001

  // Customer Details
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  billingAddress: { type: String, required: true },

  lineItems: [lineItemSchema],

  // Summary (pre-calculated & stored)
  subtotal: { type: Number, required: true },
  totalDiscount: { type: Number, required: true },
  totalGST: { type: Number, required: true },
  grandTotal: { type: Number, required: true },

  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);