module.exports = function (sequelize, Sequelize) {
  return sequelize.define('trainers', {
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
    type: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'trainers'
  });
};
