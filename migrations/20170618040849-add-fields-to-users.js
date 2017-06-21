'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'password',
        {
          type: Sequelize.STRING,
          allowNull: false
        }
      ),

      queryInterface.addColumn(
        'users',
        'salt',
        {
          type: Sequelize.STRING,
          allowNull: false
        }
      ),

      queryInterface.addColumn(
        'users',
        'username',
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        }
      )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'password'),
      queryInterface.removeColumn('users', 'salt'),
      queryInterface.removeColumn('users', 'username'),
    ]);
  }
};
