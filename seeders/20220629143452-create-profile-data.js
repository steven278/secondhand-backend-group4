'use strict';

const profiles = require('../masterdata/profiles.json').map((profiles) => {
  profiles.createdAt = new Date();
  profiles.updatedAt = new Date();
  return profiles;
})

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Profiles', profiles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Profiles', null, {});
  }
};
