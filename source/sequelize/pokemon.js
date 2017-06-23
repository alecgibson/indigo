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
    json: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'pokemon'
  });
};
