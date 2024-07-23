const db = require('../models');
const Product = db.product;


exports.createProduct = async (req, res) => {
    try {
      const { ref, name, buyPrice, quantity, expiryDate, category, minStockLevel } = req.body;
      const imagePath = req.file ? req.file.path : null; 
  
      const product = await Product.create({
        ref,
        name,
        buyPrice,
        quantity,
        expiryDate,
        category,
        minStockLevel,
        imagePath 
      });
  
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.status(204).json({ message: 'Product deleted'});
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};