const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Product', {
  id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
  title:DataTypes.STRING,
  description:DataTypes.TEXT,
  price:DataTypes.FLOAT,
  images:DataTypes.JSON,
  category:DataTypes.STRING,
  inStock:DataTypes.INTEGER
},{timestamps:true,tableName:'products'});
