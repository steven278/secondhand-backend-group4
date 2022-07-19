'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'buyer_id');
    await queryInterface.addColumn('Products', 'buyer_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'buyer_id', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
    await queryInterface.removeColumn('Products', 'buyer_id');
  }
};