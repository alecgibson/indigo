'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'seenEncounters',
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
        trainerId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'trainers',
            key: 'id'
          },
          onDelete: 'cascade'
        },
        wildEncounterId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'wildEncounters',
            key: 'id'
          },
          onDelete: 'cascade'
        }
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      }
    ).then(() => {
      return queryInterface.addIndex('seenEncounters', ['trainerId', 'wildEncounterId'], {indicesType: 'UNIQUE'});
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('seenEncounters', ['trainerId', 'wildEncounterId'])
      .then(() => {
        return queryInterface.dropTable('seenEncounters');
      });
  }
};
