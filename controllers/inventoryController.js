const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// 1. Tạo Product & tự động tạo Inventory tương ứng
exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const newProduct = await Product.create({ name, price });
    
    // Tự động tạo inventory
    const newInventory = await Inventory.create({
      product: newProduct._id,
      stock: 0,
      reserved: 0,
      soldCount: 0
    });

    res.status(201).json({ product: newProduct, inventory: newInventory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get all Inventory (join với Product)
exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('product');
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Inventory by ID (join với Product)
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('product');
    if (!inventory) return res.status(404).json({ message: "Không tìm thấy" });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Add Stock: Tăng stock
exports.addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const inventory = await Inventory.findOneAndUpdate(
      { product: product },
      { $inc: { stock: quantity } }, // $inc giúp tăng giá trị hiện tại
      { new: true }
    );
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Remove Stock: Giảm stock
exports.removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    // Điều kiện stock >= quantity để tránh bị âm
    const inventory = await Inventory.findOneAndUpdate(
      { product: product, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    );
    if (!inventory) return res.status(400).json({ message: "Stock không đủ hoặc không tìm thấy product" });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Reservation: Giảm stock, tăng reserved
exports.reservation = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const inventory = await Inventory.findOneAndUpdate(
      { product: product, stock: { $gte: quantity } },
      { $inc: { stock: -quantity, reserved: quantity } },
      { new: true }
    );
    if (!inventory) return res.status(400).json({ message: "Stock không đủ để reserve" });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Sold: Giảm reserved, tăng soldCount
exports.sold = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const inventory = await Inventory.findOneAndUpdate(
      { product: product, reserved: { $gte: quantity } },
      { $inc: { reserved: -quantity, soldCount: quantity } },
      { new: true }
    );
    if (!inventory) return res.status(400).json({ message: "Số lượng reserved không đủ" });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};