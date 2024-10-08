const Sequelize = require('sequelize');
const config = require("../config/db.config");

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    logging: console.log,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.store = require("../models/store.model.js")(sequelize, Sequelize);
db.order = require("../models/order.model.js")(sequelize, Sequelize);
db.customer = require("../models/customer.model.js")(sequelize, Sequelize);
db.supplier = require("../models/supplier.model.js")(sequelize, Sequelize);
db.orderProduct = require("../models/orderProduct.js")(sequelize, Sequelize);
db.purchase = require("../models/purchase.model.js")(sequelize, Sequelize);
db.label = require("../models/label.model.js")(sequelize, Sequelize);
db.storeProducts = require("../models/storeProducts.model.js")(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
      db[modelName].associate(db);
  }
});

// Associations
db.role.belongsToMany(db.user, { through: "user_roles" });
db.user.belongsToMany(db.role, { through: "user_roles" });
db.store.belongsToMany(db.user, { through: "user_stores" });
db.user.belongsToMany(db.store, { through: "user_stores" });

db.user.hasMany(db.product);
db.product.belongsTo(db.user);

//db.user.hasMany(db.order);
//db.order.belongsTo(db.user);

db.user.hasMany(db.customer);
db.customer.belongsTo(db.user);

db.user.hasMany(db.supplier);
db.supplier.belongsTo(db.user);

db.order.belongsToMany(db.product, { through: db.orderProduct, foreignKey: "orderId", otherKey: 'productId' });
db.product.belongsToMany(db.order, { through: db.orderProduct, foreignKey: "productId", otherKey: 'orderId' });

db.customer.hasMany(db.order);
db.order.belongsTo(db.customer);

db.store.hasMany(db.order);
db.order.belongsTo(db.store);

db.product.belongsToMany(db.supplier, { through: "supplier_products" });
db.supplier.belongsToMany(db.product, { through: "supplier_products" });

db.product.belongsToMany(db.store, { 
    through: { 
        model: sequelize.define('store_products', { 
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0 // or handle according to your use case
            }
        }),
        unique: false
    },
    foreignKey: 'productId',
    otherKey: 'storeId'
});

db.store.belongsToMany(db.product, { 
    through: { 
        model: sequelize.define('store_products', { 
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }),
        unique: false
    },
    foreignKey: 'storeId',
    otherKey: 'productId'
});


db.purchase.belongsTo(db.order);
db.label.belongsTo(db.order);



db.ROLES = ["admin", "manager", "user"];

module.exports = db;



