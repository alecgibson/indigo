'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'wildEncounters',
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
        startTime: {
          type: Sequelize.DATE,
          allowNull: false
        },
        endTime: {
          type: Sequelize.DATE,
          allowNull: false
        },
        pokemonId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'pokemon',
            key: 'id'
          },
          onDelete: 'cascade'
        },
        latitude: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        longitude: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        xMetres: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        yMetres: {
          type: Sequelize.FLOAT,
          allowNull: false
        }
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('wildEncounters');
  }
};
