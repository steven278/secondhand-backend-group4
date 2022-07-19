'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'accepted');
    await queryInterface.addColumn('Transactions', 'accepted', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'accepted', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.removeColumn('Transactions', 'accepted');
  }
};
