'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, {
        foreignKey: 'user_id'
      })
      User.belongsTo(models.Role, {
        foreignKey: 'role_id'
      })
      User.hasMany(models.Product, {
        foreignKey: 'seller_id'
      })
      User.hasMany(models.Transaction, {
        foreignKey: 'buyer_id'
      })
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    profile_id: DataTypes.INTEGER,
    isVerified: DataTypes.BOOLEAN,
    role_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};