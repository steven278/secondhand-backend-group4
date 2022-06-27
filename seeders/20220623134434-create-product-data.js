'use strict';

const products = require('../masterdata/products.json').map((product) => {
  product.createdAt = new Date();
  product.updatedAt = new Date();
  return product;
})

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
