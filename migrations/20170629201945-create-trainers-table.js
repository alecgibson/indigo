'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'trainers',
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
        type: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('trainers');
  }
};
