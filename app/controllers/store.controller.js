const fs = require('fs/promises');
const path = require('path');
const upload = require('../middlewares/upload'); 
const multer = require('multer');
const db = require('../models');
const Store = db.store;
const Product = db.product;

exports.createStore = async (req, res) => {
    try {
      const { ref, name, location } = req.body;
      const imagePath = req.file ? req.file.path : null; 
      // Create store
      const store = await Store.create({
        ref,
        name,
        location, 
        imagePath
      });
  
      res.status(201).json(store);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: Product
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStoreById = async (req, res) => {
  const { id } = req.params;

  try {
      const store = await Store.findByPk(id, {
          include: Product // Include associated products
      });

      if (!store) {
          return res.status(404).json({ message: "Store not found" });
      }

      res.json(store);
  } catch (error) {
      console.error("Error while fetching store:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateStore = async (req, res) => {
    try {
      const store = await Store.findByPk(req.params.id);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      const updateFields = { ...req.body };

      updateFields.imagePath =  req.file ? req.file.path : null; 
      
      await store.update(updateFields);
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (store) {
      await store.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignProductsToStore = async (req, res) => {
  const storeId = req.params.storeId;
  const { productIds } = req.body;

  try {
      // Find the store by ID
      const store = await Store.findByPk(storeId);
      if (!store) {
          return res.status(404).json({ message: "Store not found" });
      }

      // Find the products by IDs
      const products = await Product.findAll({
          where: {
              id: productIds
          }
      });

      // Assign products to the store using Sequelize's `addProducts` method
      await store.addProducts(products);

      res.json({ message: "Products assigned to store successfully" });
  } catch (error) {
      console.error("Error assigning products to store:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProductFromStore = async (req, res) => {
  const { storeId, productId } = req.params;
  try {
    // Find the store by ID
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Find the product by ID within the store's products
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the product from the store
    await store.removeProduct(product);

    res.status(200).json({ message: 'Product removed from store successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'An error occurred while deleting the product' });
  }
};