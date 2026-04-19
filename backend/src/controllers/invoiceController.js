const Invoice = require('../models/Invoice');

// helper: generate invoice number e.g. INV-2026-0001
const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Invoice.countDocuments();
  const padded = String(count + 1).padStart(4, '0');
  return `INV-${year}-${padded}`;
};

// helper: calculate line item totals
const calculateLineItem = (item) => {
  const { basePrice, quantity, gstPercent, discountType, discountValue } = item;

  const subtotalBeforeDiscount = basePrice * quantity;

  let discountAmount = 0;
  if (discountType === 'percent') {
    discountAmount = (subtotalBeforeDiscount * discountValue) / 100;
  } else {
    discountAmount = discountValue;
  }

  const subtotalAfterDiscount = subtotalBeforeDiscount - discountAmount;
  const gstAmount = (subtotalAfterDiscount * gstPercent) / 100;
  const rowTotal = subtotalAfterDiscount + gstAmount;

  return {
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    gstAmount: parseFloat(gstAmount.toFixed(2)),
    rowTotal: parseFloat(rowTotal.toFixed(2)),
  };
};

// GET /api/invoices  — dashboard list
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .select('invoiceNumber customerName invoiceDate grandTotal')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/invoices/:id
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/invoices
const createInvoice = async (req, res) => {
  try {
    const { customerName, phone, email, billingAddress, lineItems } = req.body;

    if (!lineItems || lineItems.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one line item is required' });
    }

    // calculate each line item
    let subtotal = 0;
    let totalDiscount = 0;
    let totalGST = 0;

    const processedLineItems = lineItems.map((item) => {
      const { discountAmount, gstAmount, rowTotal } = calculateLineItem(item);

      subtotal += item.basePrice * item.quantity;
      totalDiscount += discountAmount;
      totalGST += gstAmount;

      return {
        ...item,
        rowTotal,
      };
    });

    const grandTotal = parseFloat((subtotal - totalDiscount + totalGST).toFixed(2));

    const invoiceNumber = await generateInvoiceNumber();

    // due date = invoice date + 15 days
    const invoiceDate = new Date();
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 15);

    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      phone,
      email,
      billingAddress,
      lineItems: processedLineItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
      totalGST: parseFloat(totalGST.toFixed(2)),
      grandTotal,
      invoiceDate,
      dueDate,
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/invoices/:id
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllInvoices, getInvoiceById, createInvoice, deleteInvoice };