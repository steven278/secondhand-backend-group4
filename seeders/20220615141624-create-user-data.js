'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT_ROUNDS;

const users = require('../masterdata/users.json').map(async (user) => {
  user.createdAt = new Date();
  user.updatedAt = new Date();
  user.password = await bcrypt.hash(user.password, +saltRounds);
  return user;
});

module.exports = {
  async up(queryInterface, Sequelize) {
    const usersHashed = await Promise.all(users);
    await queryInterface.bulkInsert('Users', usersHashed, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
