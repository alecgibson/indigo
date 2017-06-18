'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    queryInterface.createTable(
      'users',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.TIME,
          defaultValue: DataTypes.NOW,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.TIME,
          defaultValue: DataTypes.NOW,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        }
      }
    );
  },

  down: function (queryInterface, DataTypes) {
    queryInterface.dropTable('users');
  }
};
