'use strict';

const bcrypt = require('bcrypt');
require('dotenv').config();
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Profile, {
        foreignKey: 'profile_id'
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
    hooks: {
      beforeCreate: async (User, options) => {
        User.password = await bcrypt.hash(User.password, +process.env.SALT_ROUNDS);
        return User;
      },
      beforeUpdate: async (User, options) => {
        User.password = await bcrypt.hash(User.password, +process.env.SALT_ROUNDS);
        return User;
      }
    }
  });
  return User;
};