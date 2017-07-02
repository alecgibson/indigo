'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
      .addColumn(
        'pokemon',
        'currentHitPoints',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      )
      .then(() => {
        return queryInterface.addColumn(
          'pokemon',
          'currentPowerPoints',
          {
            type: Sequelize.STRING,
            allowNull: false
          }
        )
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('pokemon', 'currentPowerPoints')
      .then(() => {
        return queryInterface.removeColumn('pokemon', 'currentHitPoints');
      });
  }
};
