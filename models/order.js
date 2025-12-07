const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Order', {
  id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
  stripeId:DataTypes.STRING,
  amount:DataTypes.INTEGER,
  currency:DataTypes.STRING,
  items:DataTypes.JSON,
  status:DataTypes.STRING
},{timestamps:true,tableName:'orders'});
