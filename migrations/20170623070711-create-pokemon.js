'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'pokemon',
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
        json: {
          type: Sequelize.TEXT,
          allowNull: false
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('pokemon');
  }
};
