module.exports = function(sequelize, Sequelize) {
  return sequelize.define('pokemon', {
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
    speciesId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    hitPointsValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    hitPointsIndividualValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    hitPointsEffortValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    attackValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    attackIndividualValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    attackEffortValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    defenseValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    defenseIndividualValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    defenseEffortValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    specialAttackValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    specialAttackIndividualValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    specialAttackEffortValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    specialDefenseValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    specialDefenseIndividualValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    specialDefenseEffortValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    speedValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    speedIndividualValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    speedEffortValue: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    moveIds: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    nature: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    abilityId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'pokemon'
  });
};
