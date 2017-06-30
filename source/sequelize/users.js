module.exports = function(sequelize, Sequelize) {
  return sequelize.define('users', {
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
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    activeSessionToken: {
      type: Sequelize.UUID,
      allowNull: true
    },
    newSessionToken: {
      type: Sequelize.UUID,
      allowNull: true
    },
    trainerId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'trainers',
        key: 'id'
      },
      onDelete: 'cascade'
    }
  }, {
    tableName: 'users'
  });
};
