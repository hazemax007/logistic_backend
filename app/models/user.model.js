//const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    resetToken: {
      type: Sequelize.STRING
    },
    verifyToken:{
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM('Pending', 'Active', 'Inactive'), // Change DataTypes to Sequelize
      defaultValue: 'Pending'
    },
  });
  
  return User;
};