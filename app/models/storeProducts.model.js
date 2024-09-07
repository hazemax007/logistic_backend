module.exports = (sequelize, Sequelize) => {
    const StoreProducts = sequelize.define("store_products", {
        storeId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'stores',
            key: 'id'
        }
    },
    productId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
    });
    return StoreProducts;
};