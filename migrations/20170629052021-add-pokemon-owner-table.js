'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'pokemonOwners',
      {
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
        pokemonId: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'pokemon',
            key: 'id'
          },
          onDelete: 'cascade'
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'cascade'
        },
        squadOrder: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        latitude: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        longitude: {
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
    return queryInterface.dropTable('pokemonOwners');
  }
};
