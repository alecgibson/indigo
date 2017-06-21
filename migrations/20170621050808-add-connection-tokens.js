'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'activeSessionToken',
        {
          type: Sequelize.UUID,
          allowNull: true
        }
      ),

      queryInterface.addColumn(
        'users',
        'newSessionToken',
        {
          type: Sequelize.UUID,
          allowNull: true
        }
      ),

      queryInterface.addIndex('users', ['activeSessionToken']),
      queryInterface.addIndex('users', ['newSessionToken']),
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeIndex('users', ['activeSessionToken']),
      queryInterface.removeIndex('users', ['newSessionToken']),
      queryInterface.removeColumn('users', 'activeSessionToken'),
      queryInterface.removeColumn('users', 'newSessionToken'),
    ])
  }
};
