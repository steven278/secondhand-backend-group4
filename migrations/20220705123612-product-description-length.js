'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'description', {
      allowNull: false,
      type: Sequelize.STRING(1500)
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'description', {
      allowNull: false,
      type: Sequelize.STRING
    })
  }
};
