module.exports = function(sequelize, Sequelize) {
  return sequelize.define('battleStates', {
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
  }, {
    tableName: 'battleStates'
  });
};
