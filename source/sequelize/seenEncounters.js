module.exports = function(sequelize, Sequelize) {
  return sequelize.define('seenEncounters', {
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
  }, {
    tableName: 'seenEncounters'
  });
};
