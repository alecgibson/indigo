'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'users',
      'password',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );

    queryInterface.addColumn(
      'users',
      'salt',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );

    queryInterface.addColumn(
      'users',
      'username',
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'password');
    queryInterface.removeColumn('users', 'salt');
    queryInterface.removeColumn('users', 'username');
  }
};
