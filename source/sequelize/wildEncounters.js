module.exports = function(sequelize, Sequelize) {
  return sequelize.define('wildEncounters', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.TIME,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.TIME,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
    startTime: {
      type: Sequelize.TIME,
      allowNull: false
    },
    endTime: {
      type: Sequelize.TIME,
      allowNull: false
    },
    pokemonId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'pokemon',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    latitude: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    longitude: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    xMetres: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    yMetres: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'wildEncounters'
  });
};
