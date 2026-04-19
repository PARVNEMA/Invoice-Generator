const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');

// GET /api/invoices/:id/pdf
const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);

    // ── HEADER ──────────────────────────────────────────────
    doc.fontSize(22).font('Helvetica-Bold').text('HealthyChef', { align: 'right' });
    doc.moveDown(0.5);
    doc.fontSize(16).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // ── INVOICE DETAILS ──────────────────────────────────────
    doc.fontSize(10).font('Helvetica-Bold').text('Invoice Details');
    doc.font('Helvetica');
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Invoice Date:   ${new Date(invoice.invoiceDate).toDateString()}`);
    doc.text(`Due Date:       ${new Date(invoice.dueDate).toDateString()}`);
    doc.moveDown();

    // ── CUSTOMER DETAILS ─────────────────────────────────────
    doc.font('Helvetica-Bold').text('Billed To:');
    doc.font('Helvetica');
    doc.text(`Name:    ${invoice.customerName}`);
    doc.text(`Phone:   ${invoice.phone}`);
    doc.text(`Email:   ${invoice.email}`);
    doc.text(`Address: ${invoice.billingAddress}`);
    doc.moveDown();

    // ── LINE ITEMS TABLE ─────────────────────────────────────
    doc.font('Helvetica-Bold').text('Line Items');
    doc.moveDown(0.5);

    // table column x positions
    const col = { item: 50, variant: 160, qty: 255, price: 295, gst: 350, disc: 400, total: 460 };
    const tableTop = doc.y;

    // table header row
    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('Item',        col.item,    tableTop);
    doc.text('Variant',     col.variant, tableTop);
    doc.text('Qty',         col.qty,     tableTop);
    doc.text('Base Price',  col.price,   tableTop);
    doc.text('GST%',        col.gst,     tableTop);
    doc.text('Discount',    col.disc,    tableTop);
    doc.text('Row Total',   col.total,   tableTop);

    doc.moveTo(50, doc.y + 4).lineTo(550, doc.y + 4).stroke();
    doc.moveDown(0.8);

    // table rows
    doc.font('Helvetica').fontSize(9);
    invoice.lineItems.forEach((li) => {
      const y = doc.y;
      const discDisplay =
        li.discountType === 'percent'
          ? `${li.discountValue}%`
          : `₹${li.discountValue.toFixed(2)}`;

      doc.text(li.itemName,                          col.item,    y, { width: 105 });
      doc.text(li.variantDescription || '-',         col.variant, y, { width: 90 });
      doc.text(String(li.quantity),                  col.qty,     y);
      doc.text(`₹${li.basePrice.toFixed(2)}`,        col.price,   y);
      doc.text(`${li.gstPercent}%`,                  col.gst,     y);
      doc.text(discDisplay,                          col.disc,    y);
      doc.text(`₹${li.rowTotal.toFixed(2)}`,         col.total,   y);
      doc.moveDown(1.2);
    });

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // ── CALCULATION SUMMARY ──────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(10).text('Calculation Summary');
    doc.font('Helvetica').fontSize(10);
    doc.text(`Subtotal:        ₹${invoice.subtotal.toFixed(2)}`);
    doc.text(`Total Discount:  - ₹${invoice.totalDiscount.toFixed(2)}`);
    doc.text(`Total GST:       + ₹${invoice.totalGST.toFixed(2)}`);
    doc.font('Helvetica-Bold').text(`GRAND TOTAL:     ₹${invoice.grandTotal.toFixed(2)}`);
    doc.moveDown();

    // ── TERMS & CONDITIONS ───────────────────────────────────
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(10).text('Terms & Conditions');
    doc.font('Helvetica').fontSize(9);
    doc.text('1. Payment Terms: Payment is due within 15 days of the invoice date.');
    doc.text('2. Late Fees: A late fee of 2% per month will be applied to overdue balances.');
    doc.text('3. Jurisdiction: All disputes are subject to Bengaluru jurisdiction only.');
    doc.text('4. Thank you for choosing HealthyChef!');

    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { downloadInvoicePDF };