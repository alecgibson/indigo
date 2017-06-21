'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.TIME,
          defaultValue: Sequelize.NOW,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.TIME,
          defaultValue: Sequelize.NOW,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        }
      }
    );
  },

  down: function (queryInterface, DataTypes) {
    return queryInterface.dropTable('users');
  }
};
