const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', require('./src/routes/itemRoutes'));
app.use('/api/invoices', require('./src/routes/invoiceRoutes'));

module.exports = app;

