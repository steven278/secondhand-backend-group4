'use strict';
const categories = require('../masterdata/categories.json').map((category) => {
  category.createdAt = new Date();
  category.updatedAt = new Date();
  return category;
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
