'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id'
      })
      Product.belongsTo(models.User, {
        foreignKey: 'seller_id'
      })
    }
  }
  Product.init({
    seller_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    photos: DataTypes.ARRAY(DataTypes.STRING),
    isSold: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};