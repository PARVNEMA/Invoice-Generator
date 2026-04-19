const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');

const MARGIN = 48;
const PAGE_WIDTH = 595.28; // A4 width
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const formatDate = (value) =>
	new Date(value).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

const formatMoney = (value) =>
	Number(value || 0).toFixed(2);

const drawRule = (doc) => {
	doc
		.moveTo(MARGIN, doc.y)
		.lineTo(MARGIN + CONTENT_WIDTH, doc.y)
		.lineWidth(1)
		.strokeColor("#9ca3af")
		.stroke();
	doc.moveDown(0.6);
};

const drawSectionTitle = (doc, title) => {
	doc
		.font("Helvetica-Bold")
		.fontSize(10)
		.fillColor("#111111")
		.text(title, MARGIN, doc.y);
	doc.moveDown(0.45);
};

const ensurePageForRow = (
	doc,
	requiredHeight,
	drawTableHeader,
) => {
	const pageBottomLimit = doc.page.height - MARGIN - 40;
	if (doc.y + requiredHeight > pageBottomLimit) {
		doc.addPage();
		if (drawTableHeader) {
			drawTableHeader();
		}
	}
};

const drawLineItemsTable = (doc, invoice) => {
	drawSectionTitle(doc, "Line Items");

	const columns = [
		{
			key: "itemName",
			label: "Item Name",
			x: MARGIN,
			width: 85,
			align: "left",
		},
		{
			key: "variantDescription",
			label: "Variant / Description",
			x: MARGIN + 88,
			width: 88,
			align: "left",
		},
		{
			key: "quantity",
			label: "Qt",
			x: MARGIN + 179,
			width: 20,
			align: "center",
		},
		{
			key: "basePrice",
			label: "Base Price",
			x: MARGIN + 202,
			width: 52,
			align: "right",
		},
		{
			key: "gstPercent",
			label: "GST",
			x: MARGIN + 257,
			width: 35,
			align: "center",
		},
		{
			key: "discount",
			label: "Discount",
			x: MARGIN + 295,
			width: 48,
			align: "right",
		},
		{
			key: "rowTotal",
			label: "Row Total",
			x: MARGIN + 346,
			width: 56,
			align: "right",
		},
	];

	const drawHeader = () => {
		const y = doc.y;
		const rowHeight = 30;
		doc
			.rect(MARGIN, y, CONTENT_WIDTH, rowHeight)
			.strokeColor("#d1d5db")
			.lineWidth(1)
			.stroke();
		doc
			.font("Helvetica-Bold")
			.fontSize(8)
			.fillColor("#111111");
		columns.forEach((column) => {
			doc.text(column.label, column.x + 4, y + 10, {
				width: column.width - 8,
				align: column.align,
			});
		});
		doc.y = y + rowHeight;
	};

	drawHeader();

	doc.font("Helvetica").fontSize(8).fillColor("#111111");

	invoice.lineItems.forEach((item) => {
		ensurePageForRow(doc, 44, drawHeader);
		const y = doc.y;
		const rowHeight = 44;

		doc
			.rect(MARGIN, y, CONTENT_WIDTH, rowHeight)
			.strokeColor("#d1d5db")
			.lineWidth(1)
			.stroke();
		columns.forEach((column, index) => {
			if (index !== 0) {
				doc
					.moveTo(column.x, y)
					.lineTo(column.x, y + rowHeight)
					.strokeColor("#e5e7eb")
					.lineWidth(1)
					.stroke();
			}
		});

		const discountText =
			item.discountType === "percent"
				? `${Number(item.discountValue || 0)}%`
				: `Rs ${formatMoney(item.discountValue)}`;

		const values = {
			itemName: item.itemName || "-",
			variantDescription: item.variantDescription || "-",
			quantity: String(item.quantity || 0),
			basePrice: formatMoney(item.basePrice),
			gstPercent: `${item.gstPercent || 0}%`,
			discount: discountText,
			rowTotal: formatMoney(item.rowTotal),
		};

		doc.text(values.itemName, columns[0].x + 4, y + 10, {
			width: columns[0].width - 8,
		});
		doc.text(
			values.variantDescription,
			columns[1].x + 4,
			y + 10,
			{
				width: columns[1].width - 8,
			},
		);
		doc.text(values.quantity, columns[2].x + 2, y + 14, {
			width: columns[2].width - 4,
			align: "center",
		});
		doc.text(values.basePrice, columns[3].x + 2, y + 14, {
			width: columns[3].width - 4,
			align: "right",
		});
		doc.text(values.gstPercent, columns[4].x + 2, y + 14, {
			width: columns[4].width - 4,
			align: "center",
		});
		doc.text(values.discount, columns[5].x + 2, y + 14, {
			width: columns[5].width - 4,
			align: "right",
		});
		doc.text(values.rowTotal, columns[6].x + 2, y + 14, {
			width: columns[6].width - 4,
			align: "right",
		});

		doc.y = y + rowHeight;
	});

	doc.moveDown(0.6);
	drawRule(doc);
};

const drawSummary = (doc, invoice) => {
	drawSectionTitle(doc, "Calculation Summary");
	doc.font("Helvetica").fontSize(8).fillColor("#111111");
	doc.text(
		`Subtotal : Rs ${formatMoney(invoice.subtotal)}`,
	);
	doc.text(
		`Total Discount : - Rs ${formatMoney(invoice.totalDiscount)}`,
	);
	doc.text(
		`Total GST : + Rs ${formatMoney(invoice.totalGST)}`,
	);
	doc
		.font("Helvetica-Bold")
		.text(
			`GRAND TOTAL : Rs ${formatMoney(invoice.grandTotal)}`,
		);
	doc.moveDown(0.55);
	drawRule(doc);
};

const drawTerms = (doc) => {
	drawSectionTitle(doc, "Terms & Conditions");
	doc.font("Helvetica").fontSize(8).fillColor("#111111");
	doc.text(
		"1. Payment Terms: Payment is due within 15 days of the invoice date.",
	);
	doc.text(
		"2. Late Fees: A late fee of 2% per month will be applied to overdue balances.",
	);
	doc.text(
		"3. Jurisdiction: All disputes are subject to Bengaluru jurisdiction only.",
	);
	doc.text("4. Thank you for choosing HealthyChef!");
	doc.moveDown(0.4);
	drawRule(doc);
};

const drawInvoiceMeta = (doc, invoice) => {
	doc
		.font("Helvetica-Bold")
		.fontSize(9)
		.fillColor("#111111")
		.text("SAMPLE Invoice PDF", MARGIN, MARGIN, {
			width: CONTENT_WIDTH,
			align: "center",
		});

	doc.moveDown(1.2);

	doc
		.font("Helvetica-Bold")
		.fontSize(10)
		.text("Invoice Details");
	doc.moveDown(0.3);
	doc.font("Helvetica").fontSize(8);
	doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
	doc.text(
		`Invoice Date: ${formatDate(invoice.invoiceDate)}`,
	);
	doc.text(`Due Date: ${formatDate(invoice.dueDate)}`);

	doc.moveDown(0.8);
	doc
		.font("Helvetica-Bold")
		.fontSize(10)
		.text("Billed To:");
	doc.moveDown(0.35);
	doc.font("Helvetica").fontSize(8);
	doc.text(`Customer Name: ${invoice.customerName}`);
	doc.text(`Phone Number: ${invoice.phone}`);
	doc.text(`Email ID: ${invoice.email}`);
	doc.text(`Billing Address: ${invoice.billingAddress}`);

	doc.moveDown(0.65);
	drawRule(doc);
};

// GET /api/invoices/:id/pdf
const downloadInvoicePDF = async (req, res) => {
	try {
		const invoice = await Invoice.findById(req.params.id);
		if (!invoice) {
			return res.status(404).json({
				success: false,
				message: "Invoice not found",
			});
		}

		const doc = new PDFDocument({
			size: "A4",
			margin: MARGIN,
		});

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${invoice.invoiceNumber}.pdf"`,
		);
		doc.pipe(res);

		drawInvoiceMeta(doc, invoice);
		drawLineItemsTable(doc, invoice);
		drawSummary(doc, invoice);
		drawTerms(doc);

		doc.end();
	} catch (err) {
		res
			.status(500)
			.json({ success: false, message: err.message });
	}
};

module.exports = { downloadInvoicePDF };
