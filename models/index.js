const sequelize = require('../lib/db');
const User = require('./user')(sequelize);
const Product = require('./product')(sequelize);
const Order = require('./order')(sequelize);
module.exports = { sequelize, User, Product, Order };
