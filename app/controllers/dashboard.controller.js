const db = require('../models'); // Assuming your models are set up
const { sequelize } = require('../models'); // Adjust the path according to your project structure
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');


// Total Sales Value
exports.totalSalesValue = async (req, res) => {
  try {
    const totalSales = await db.order.sum('value', { where: { status: 'delivered' } });
    res.json({ totalSales });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
  }
}

// Number of Delivered Orders
exports.numbDeliveredOrders = async (req, res) => {
    try {
      const orderCount = await db.order.count({ where: { status: 'delivered' } });
      res.json({ orderCount });
    } catch (err) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }

  // Order Status Distribution
exports.orderStatusDistribution = async (req, res) => {
    try {
      const statuses = await db.order.findAll({
        attributes: [
          'status',
          [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']
        ],
        group: 'status'
      });
      res.json(statuses);
    } catch (err) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }
  
  // Sales Over Time
  exports.salesOverTime = async (req, res) => {
    const { period = 'month' } = req.query; // Use 'month', 'week', 'day', etc.
    try {
      const sales = await db.order.findAll({
        attributes: [
          [db.Sequelize.fn('DATE_TRUNC', period, db.Sequelize.col('createdAt')), 'period'],
          [db.Sequelize.fn('SUM', db.Sequelize.col('value')), 'total']
        ],
        where: { status: 'delivered' },
        group: [db.Sequelize.literal('period')],
        order: [db.Sequelize.literal('period')]
      });
      res.json(sales);
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  
  // Top Products by Sales
  exports.getTopProductsBySales = async (req, res) => {
    console.log('Starting getTopProductsBySales function');
    try {
      console.log('Executing SQL query');
      const [results, metadata] = await sequelize.query(`
        SELECT "products".* 
        FROM (
          SELECT "products"."id", "products"."name", SUM("order_products"."price") AS "totalSales" 
          FROM "products"
          INNER JOIN "order_products" ON "products"."id" = "order_products"."productId"
          INNER JOIN "orders" ON "order_products"."orderId" = "orders"."id"
          WHERE "orders"."status" = 'delivered'
          GROUP BY "products"."id", "products"."name"
          ORDER BY "totalSales" DESC 
          LIMIT 10
        ) AS "products"
        ORDER BY "totalSales" DESC;
      `, { 
        logging: console.log, // This will log the generated SQL
        timeout: 30000 // Set a 30 second timeout
      });
      
      console.log(`Query completed. Found ${results.length} results.`);
      res.json(results);
    } catch (error) {
      console.error('Error in getTopProductsBySales:', error);
      res.status(500).json({ error: 'An error occurred while fetching top products by sales.' });
    }
  };

exports.getTopProductsByQuantity = async (req,res) => {
  console.log('Starting getTopProductsBySales function');
    try {
      console.log('Executing SQL query');
      const [results, metadata] = await sequelize.query(`
        SELECT "products".* 
        FROM (
          SELECT "products"."id", "products"."name", SUM("order_products"."quantity") AS "totalQuantity" 
          FROM "products"
          INNER JOIN "order_products" ON "products"."id" = "order_products"."productId"
          INNER JOIN "orders" ON "order_products"."orderId" = "orders"."id"
          WHERE "orders"."status" = 'delivered'
          GROUP BY "products"."id", "products"."name"
          ORDER BY "totalQuantity" DESC 
          LIMIT 10
        ) AS "products"
        ORDER BY "totalQuantity" DESC;
      `, { 
        logging: console.log, // This will log the generated SQL
        timeout: 30000 // Set a 30 second timeout
      });
      
      console.log(`Query completed. Found ${results.length} results.`);
      res.json(results);
    } catch (error) {
      console.error('Error in getTopProductsByQuantity:', error);
      res.status(500).json({ error: 'An error occurred while fetching top products by quantity.' });
    }
}

exports.getProductStockLevels = async (req, res) => {
  try {
      const products = await db.product.findAll({
          attributes: ['id', 'name', 'quantity', 'minStockLevel'],
          raw: true
      });

      const result = products.map(product => ({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
          belowMinStock: product.quantity < product.minStockLevel
      }));

      res.json(result);
  } catch (error) {
      console.error('Error fetching product stock levels:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProductCategories = async (req,res) => {
  try {
    const categories = await db.product.findAll({
        attributes: [
            'category',
            [sequelize.fn('COUNT', sequelize.col('id')), 'productCount']
        ],
        group: ['category'],
        raw: true
    });

    res.json(categories);
} catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}

exports.getUpcomingExpiryProducts = async (req,res) => {
  try {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const products = await db.product.findAll({
        where: {
            expiryDate: {
                [Sequelize.Op.between]: [today, nextMonth]
            }
        },
        attributes: ['id', 'name', 'expiryDate'],
        order: [['expiryDate', 'ASC']],
        raw: true
    });

    res.json(products);
} catch (error) {
    console.error('Error fetching products with upcoming expiry dates:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}


// Controller function for getting sales by store
exports.getSalesByStore = async (req, res) => {
  try {
      const storeSales = await db.order.findAll({
          attributes: [
              'storeId',
              [sequelize.fn('SUM', sequelize.col('value')), 'totalSales']
          ],
          where: { status: 'delivered' },
          include: [{
              model: db.store,
              attributes: ['id', 'name']
          }],
          group: ['storeId', 'store.id', 'store.name']
      });

      res.status(200).json(storeSales);
  } catch (error) {
      console.error('Error fetching sales by store:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

// Corrected function to fetch product availability by store
exports.getProductAvailabilityByStore = async (req, res) => {
  try {
      const productAvailability = await db.order.findAll({
          attributes: [
              'storeId',
              [sequelize.fn('COUNT', sequelize.col('orderProduct.productId')), 'productCount']
          ],
          include: [
              {
                  model: db.orderProduct,
                  attributes: [],
                  include: [{
                      model: db.product,
                      attributes: ['id', 'name']
                  }]
              },
              {
                  model: db.store,
                  attributes: ['id', 'name']
              }
          ],
          group: ['storeId', 'store.id', 'store.name', 'orderProduct.productId', 'product.id', 'product.name']
      });

      res.status(200).json(productAvailability);
  } catch (error) {
      console.error('Error fetching product availability by store:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPurchaseFeedback = async (req, res) => {
  try {
      const feedbackStats = await db.purchase.findAll({
          attributes: [
              [db.Sequelize.fn('count', db.Sequelize.col('feedback')), 'count'],
              'feedback'
          ],
          group: ['feedback']
      });

      const response = feedbackStats.map(item => ({
          feedback: item.feedback,
          count: item.dataValues.count
      }));

      res.status(200).json(response);
  } catch (error) {
      console.error("Error fetching purchase feedback stats:", error);
      res.status(500).send({ message: "Error fetching purchase feedback stats" });
  }
};
exports.getPurchaseHistory = async (req, res) => {
  try {
      // Assuming purchases have a 'date' and 'paymentMethod' column
      const purchaseHistory = await db.purchase.findAll({
          attributes: [
              'id',
              'purchaseDate',
              'paymentMethod',
              'feedback',
          ],
          order: [['purchaseDate', 'DESC']]
      });

      res.status(200).json(purchaseHistory);
  } catch (error) {
      console.error('Error fetching purchase history:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerDemographics = async (req, res) => {
  try {
      const demographics = await db.customer.findAll({
          attributes: [
              [db.Sequelize.fn('count', db.Sequelize.col('id')), 'customerCount'],
              'address', 'billingAddress'
          ],
          group: ['address', 'billingAddress']
      });

      const response = demographics.map(item => ({
        address: item.address,
        billingAddress: item.billingAddress,
          customerCount: item.dataValues.customerCount
      }));

      res.status(200).json(response);
  } catch (error) {
      console.error("Error fetching customer demographics:", error);
      res.status(500).send({ message: "Error fetching customer demographics" });
  }
};

exports.getTopCustomers = async (req, res) => {
  console.log('Starting getTopCustomers function');
  try {
    console.log('Executing SQL query');
    const [results, metadata] = await sequelize.query(`
      SELECT "customers".* 
      FROM (
        SELECT "customers"."id", "customers"."lastname", SUM("orders"."value") AS "totalSpent" 
        FROM "customers"
        INNER JOIN "orders" ON "customers"."id" = "orders"."customerId"
        GROUP BY "customers"."id", "customers"."lastname"
        ORDER BY "totalSpent" DESC 
        LIMIT 10
      ) AS "customers"
      ORDER BY "totalSpent" DESC;
    `, { 
      logging: console.log, // This will log the generated SQL
      timeout: 30000 // Set a 30 second timeout
    });
    
    console.log(`Query completed. Found ${results.length} results.`);
    res.json(results);
  } catch (error) {
    console.error('Error in getTopCustomers:', error);
    res.status(500).json({ error: 'An error occurred while fetching top customers.' });
  }
};

const getDateRange = (filter) => {
  const start = new Date();
  const end = new Date();

  switch (filter) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'day':
      start.setDate(start.getDate() - 1);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      break;
  }
  return { start, end };
};

exports.getDashboardStats = async (req, res) => {
  const filter = req.query.filter || 'today'; // Default filter is 'today'
  const { start, end } = getDateRange(filter);

  try {
    const totalOrders = await db.order.count({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        },
      }
    });

    const totalRevenue = await db.order.sum('value', {
      where: {
        createdAt: {
          [Op.between]: [start, end]
        },
        status: 'delivered'
      }
    });

    const totalQuantityInHand = await db.product.sum('quantity');

    res.json({
      totalOrders,
      totalRevenue,
      totalQuantityInHand
    });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching dashboard stats' });
  }
};
