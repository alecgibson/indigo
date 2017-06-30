'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropTable('pokemonOwners'),

      queryInterface.addColumn(
        'users',
        'trainerId',
        {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'trainers',
            key: 'id'
          },
          onDelete: 'cascade'
        }
      ),

      queryInterface.addColumn(
        'wildEncounters',
        'level',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        },
      ),

      queryInterface.removeColumn(
        'wildEncounters',
        'pokemonId'
      ),

      queryInterface.addColumn(
        'pokemon',
        'trainerId',
        {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'trainers',
            key: 'id'
          },
          onDelete: 'cascade'
        }
      ),

      queryInterface.addColumn(
        'pokemon',
        'squadOrder',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('pokemon', 'squadOrder'),
      queryInterface.removeColumn('pokemon', 'trainerId'),

      queryInterface.addColumn(
        'wildEncounters',
        'pokemonId',
        {
          type: Sequelize.UUID,
          references: {
            model: 'pokemon',
            key: 'id'
          },
          onDelete: 'cascade'
        }
      ),

      queryInterface.removeColumn('wildEncounters', 'level'),
      queryInterface.removeColumn('users', 'trainerId'),

      queryInterface.createTable(
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
    ])
  }
};
