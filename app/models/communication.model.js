module.exports = (sequelize, Sequelize) => {
    const Communication = sequelize.define("communication", {
      type: {
        type: Sequelize.ENUM('Email', 'Phone Call', 'Meeting'),
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
    });
  
    return Communication;
  };