'use strict';

const cities = require('../masterdata/cities.json').map(async (user) => {
  city.createdAt = new Date();
  city.updatedAt = new Date();
  return city;
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cities', cities, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cities', null, {});
  }
};
