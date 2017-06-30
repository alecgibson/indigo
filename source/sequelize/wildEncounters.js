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
    speciesId: {
      type: Sequelize.INTEGER,
      allowNull: false
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
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'wildEncounters'
  });
};
