'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.TIME,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.TIME,
          allowNull: false
        },
        email: {
          type: Sequelize.TEXT,
          unique: true,
          allowNull: false
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('users');
  }
};
