const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('User', {
  id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
  name:DataTypes.STRING,
  email:{type:DataTypes.STRING,unique:true},
  password:DataTypes.STRING,
  isAdmin:{type:DataTypes.BOOLEAN,defaultValue:false}
},{timestamps:true,tableName:'users'});
