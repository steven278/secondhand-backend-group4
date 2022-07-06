'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.hasOne(models.User, {
        foreignKey: 'profile_id',
        // onUpdate: 'CASCADE'
      })
    }
  }
  Profile.init({
    photo: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};