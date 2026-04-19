// models/Item.js
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },  // e.g. "Size", "Color"
  value: { type: String, required: true }, // e.g. "Large", "Red"
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  variants: [variantSchema],
  basePrice: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);