module.exports = (sequelize, Sequelize) => {
    const OrderProduct = sequelize.define("order_products", {
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    });

    return OrderProduct;
};


