'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: 'buyer_id'
      })
      Transaction.belongsTo(models.Product, {
        foreignKey: 'product_id'
      })
    }
  }
  Transaction.init({
    buyer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    nego_price: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};