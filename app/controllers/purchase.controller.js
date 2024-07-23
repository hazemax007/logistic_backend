const db = require("../models");
const Order = db.order;
const Purchase = db.purchase;

// Update the status of an order and create a purchase if delivered
exports.createPurchase = async (req, res) => {
  const id = req.params.id;
  const { status, itemsPurchased, quantities, prices, paymentMethod } = req.body;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).send({ message: `Order with id=${id} not found.` });
    }

    // Update order status
    order.status = status;
    await order.save();

    // If status is delivered, create a purchase record
    if (status === 'delivered') {
      const purchase = {
        orderId: id,
        orderDate: order.deliveryDate,
        paymentMethod: paymentMethod
      };

      const data = await Purchase.create(purchase);
      return res.send({ message: "Order delivered and purchase recorded.", purchase: data });
    }

    res.send({ message: `Order status updated to ${status}.` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error updating order status."
    });
  }
};
