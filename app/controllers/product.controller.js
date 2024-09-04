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

  exports.createProductt = async (req, res) => {
    try {
        const {
            ref, name, buyPrice, quantity, expiryDate, category, minStockLevel,
            supplierNames = [], storeNames = []
        } = req.body;
        const imagePath = req.file ? req.file.path : null; 

        // Find supplier IDs by names
        const suppliers = await db.supplier.findAll({
            attributes: ['id', 'name'],
            where: {
                name: supplierNames
            }
        });
        const supplierIds = suppliers.map(supplier => supplier.id);

        // Find store IDs by names
        const stores = await db.store.findAll({
            attributes: ['id', 'name'],
            where: {
                name: storeNames
            }
        });
        const storeIds = stores.map(store => store.id);

        // Create the product
        const product = await db.product.create({
            ref,
            name,
            buyPrice,
            quantity,
            expiryDate,
            category,
            minStockLevel,
            imagePath 
        });

        // Associate suppliers
        if (supplierIds.length > 0) {
            await product.addSuppliers(supplierIds);
        }

        // Associate stores
        if (storeIds.length > 0) {
            await product.addStores(storeIds);
        }

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getAllProducts = async (req, res) => {
  try {
    // Fetch products along with associated suppliers and stores
    const products = await db. product.findAll({
      include: [
        {
          model: db. supplier,
          as: 'suppliers',  // Adjust alias based on your associations
          attributes: ['id', 'name', 'phone'],  // Specify attributes to include
        },
        {
          model: db.store,
          as: 'stores',  // Adjust alias based on your associations
          attributes: ['id', 'name', 'location'],  // Specify attributes to include
        }
      ],
    });
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