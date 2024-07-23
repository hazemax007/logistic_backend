module.exports = (sequelize, Sequelize) => {
    const Purchase = sequelize.define("purchases", {
      ref: {
        type: Sequelize.STRING,
        unique: true
      },
      purchaseDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true
      },
      feedback: {
      type:  Sequelize.ENUM('awkward', 'bad', 'okay', 'good', "top"),
      defaultValue: "okay"
    }
    });
  
    return Purchase;
  };
  