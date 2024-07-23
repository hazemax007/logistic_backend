module.exports = (sequelize, Sequelize) => {
    const Store = sequelize.define("stores", {
      ref: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      imagePath:{
        type: Sequelize.STRING
      },
    });
  
    return Store;
  };