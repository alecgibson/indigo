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
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        }
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      }
    );
  },

  down: function (queryInterface, DataTypes) {
    return queryInterface.dropTable('users');
  }
};
