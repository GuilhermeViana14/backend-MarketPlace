const User = require('./User');
const Product = require('./Product');

// Definir associações
User.hasMany(Product, {
  foreignKey: 'sellerId',
  as: 'products'
});

Product.belongsTo(User, {
  foreignKey: 'sellerId',
  as: 'seller'
});

module.exports = {
  User,
  Product
};
