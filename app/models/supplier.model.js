module.exports = (sequelize, Sequelize) => {
    const Supplier = sequelize.define("suppliers", {
      name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      paymentTerms: {
        type: Sequelize.STRING,
        allowNull: true
      },
      deliveryTerms: {
        type: Sequelize.STRING,
        allowNull: true
      },
      specialAgreements: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  
    return Supplier;
  };