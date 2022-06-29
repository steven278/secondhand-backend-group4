'use strict';

const roles = require('../masterdata/roles.json').map((role) => {
  role.createdAt = new Date();
  role.updatedAt = new Date();
  return role;
})

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, { truncate: true, restartIdentity: true });
  }
};
