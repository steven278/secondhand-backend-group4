'use strict';

const transactions = require('../masterdata/transactions.json').map((transaction) => {
  transaction.createdAt = new Date();
  transaction.updatedAt = new Date();
  return transaction;
})

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Transactions', transactions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};
