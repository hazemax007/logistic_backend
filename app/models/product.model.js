module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
        ref: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        buyPrice: {
            type: Sequelize.FLOAT
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        minStockLevel: {
            type: Sequelize.INTEGER,
        },
        expiryDate: {
            type: Sequelize.DATE
        },
        category: {
            type: Sequelize.ENUM('category1', 'category2', 'category3'),
            defaultValue: 'category1'
        },
        imagePath: {
            type: Sequelize.STRING,
        }
    });

    return Product;
};
