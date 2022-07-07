'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'description', {
      allowNull: false,
      type: Sequelize.TEXT
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'description', {
      allowNull: false,
      type: Sequelize.DataTypes.STRING(1500)
    })
  }
};

