'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
        'battles',
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
        },
        {
          charset: 'utf8',
          collate: 'utf8_unicode_ci'
        }
      )
      .then(() => {
        return queryInterface.createTable(
          'battleStates',
          {
            trainerId: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false,
              references: {
                model: 'trainers',
                key: 'id'
              },
              onDelete: 'cascade'
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
            battleId: {
              type: Sequelize.UUID,
              allowNull: false,
              references: {
                model: 'battles',
                key: 'id'
              },
              onDelete: 'cascade'
            },
            action: {
              type: Sequelize.STRING,
              allowNull: true
            },
            activePokemonId: {
              type: Sequelize.UUID,
              allowNull: false,
              references: {
                model: 'pokemon',
                key: 'id'
              }
            }
          },
          {
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
          }
        );
      })
      .then(() => {
        return queryInterface.addIndex('battleStates', ['battleId']);
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('battleStates')
      .then(() => {
        return queryInterface.dropTable('battles');
      });
  }
};
