const db = require('../models');
const Order = db.order;
const Product = db.product;
const Purchase = db.purchase;
const Label = db.label;
const Supplier = db.supplier;
const OrderProduct = db.orderProduct
const Sequelize = db.Sequelize;
const { Op } = require("sequelize");
const { sequelize } = require('../models');

exports.fetchOrdersTotalPriceData = async (req,res) => {
    
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: Product,
                    through: { attributes: ['quantity', 'price'] }
                }
            ]
        });

        const statistics = {
            processing: [],
            shipped: [],
            delivered: []
        };

        const dates = [...new Set(orders.map(order => order.createdAt.toISOString().split('T')[0]))];

        dates.forEach(date => {
            let processingTotal = 0;
            let shippedTotal = 0;
            let deliveredTotal = 0;

            orders.forEach(order => {
                if (order.createdAt.toISOString().split('T')[0] === date) {
                    let total = 0;
                    order.products.forEach(product => {
                        const orderProduct = product.order_products; // assurez-vous que ceci correspond à la clé associée
                        if (orderProduct) {
                            total += orderProduct.price * orderProduct.quantity;
                        }
                    });

                    if (order.status === 'processing') processingTotal += total;
                    if (order.status === 'shipped') shippedTotal += total;
                    if (order.status === 'delivered') deliveredTotal += total;
                }
            });

            statistics.processing.push({ date, total: processingTotal });
            statistics.shipped.push({ date, total: shippedTotal });
            statistics.delivered.push({ date, total: deliveredTotal });
        });

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

exports.getDashboardStats = async (req, res) => {
    try {
      const totalLabels = await Label.count();
      const totalOrders = await Order.count();
      const totalRevenue = await Order.sum('value');
      const totalCost = await Product.sum('buyPrice');
      const totalQuantityInHand = await Product.sum('quantity');
      const totalToBeReceived = await Order.count({ where: { status: 'processing' } });
      const totalSuppliers = await Supplier.count();
      const totalCategories = await Product.count({ col: 'category' });
      const totalPurchases = await Purchase.count();
  
      res.status(200).send({
        totalLabels,
        totalOrders,
        totalRevenue,
        totalCost,
        totalQuantityInHand,
        totalToBeReceived,
        totalSuppliers,
        totalCategories,
        totalPurchases
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  exports.getMonthlyLabelsAndPurchases = async (req, res) => {
    try {
      const labelsPerMonth = await Label.findAll({
        attributes: [
          [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'month'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt'))],
        order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'ASC']]
      });
  
      const purchasesPerMonth = await Purchase.findAll({
        attributes: [
          [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('purchaseDate')), 'month'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('purchaseDate'))],
        order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('purchaseDate')), 'ASC']]
      });
  
      res.status(200).send({
        labelsPerMonth,
        purchasesPerMonth
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  exports.getPurchasesByFeedback = async (req, res) => {
    try {
      const purchases = await db.purchase.findAll({
        attributes: ['feedback', [db.Sequelize.fn('COUNT', db.Sequelize.col('feedback')), 'count']],
        group: ['feedback']
      });
  
      res.json(purchases);
    } catch (error) {
      console.error('Error fetching purchases feedback data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };
  
  exports.getLabelsByWeightRange = async (req, res) => {
    try {
      const labelsByWeightRange = await Label.findAll({
        attributes: [
          [Sequelize.literal(`CASE 
            WHEN weight BETWEEN 0 AND 5 THEN '0-5'
            WHEN weight BETWEEN 5 AND 10 THEN '5-10'
            WHEN weight BETWEEN 10 AND 15 THEN '10-15'
            WHEN weight BETWEEN 15 AND 20 THEN '15-20'
            ELSE '20+' END`), 'weightRange'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['weightRange']
      });
  
      res.status(200).send(labelsByWeightRange);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  exports.getTopSellingProducts = async (req, res) => {
    try {
      const topSellingProducts = await Product.findAll({
        attributes: [
          'name',
          [Sequelize.fn('SUM', Sequelize.col('order_products.quantity')), 'totalSold']
        ],
        include: [
          {
            model: Order,
            through: {
              model: OrderProduct,
              attributes: [] // Do not select any attributes from the through table
            }
          }
        ],
        group: ['Product.id', 'Product.name'],
        order: [[Sequelize.literal('totalSold'), 'DESC']],
        limit: 5
      });
  
      res.status(200).send({ topSellingProducts });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };