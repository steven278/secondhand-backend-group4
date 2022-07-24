'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notification.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });
      Notification.belongsTo(models.Transaction, {
        foreignKey: 'transaction_id'
      });
    }
  }
  Notification.init({
    product_id: DataTypes.INTEGER,
    transaction_id: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};