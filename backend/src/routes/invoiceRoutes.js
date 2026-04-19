const express = require('express');
const router = express.Router();
const { getAllInvoices, getInvoiceById, createInvoice, deleteInvoice } = require('../controllers/invoiceController');
const { downloadInvoicePDF } = require('../controllers/pdfController');

router.get('/',           getAllInvoices);
router.get('/:id',        getInvoiceById);
router.post('/',          createInvoice);
router.delete('/:id',     deleteInvoice);
router.get('/:id/pdf',    downloadInvoicePDF);  // PDF download

module.exports = router;