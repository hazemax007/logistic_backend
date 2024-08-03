module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("orders", {
        ref: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.FLOAT
        },
        deliveryLocation: {
            type: Sequelize.STRING
        },
        deliveryDate: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM('processing', 'shipped', 'delivered', 'returned'),
            defaultValue: 'processing'
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return Order;
};



