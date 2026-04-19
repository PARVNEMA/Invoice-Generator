const Item = require('../models/Item');

// GET /api/items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/items
const createItem = async (req, res) => {
  try {
    const { name, description, variants, basePrice } = req.body;
    const item = await Item.create({ name, description, variants, basePrice });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const { name, description, variants, basePrice } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description, variants, basePrice },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };
