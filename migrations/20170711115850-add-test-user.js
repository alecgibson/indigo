'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize
      .query(
        "INSERT INTO trainers (id, \"createdAt\", \"updatedAt\", type) VALUES ('3dba8270-87c0-4e76-b73e-aa900a4fe2be', NOW(), NOW(), 0);"
      )
      .then(() => {
        return queryInterface.sequelize.query(
          "INSERT INTO users (" +
          "id, " +
          "\"createdAt\", " +
          "\"updatedAt\", " +
          "email, " +
          "password, " +
          "salt, " +
          "username, " +
          "\"trainerId\") VALUES (" +
          "'74444590-607f-47d7-9a3a-7805fa504f45', " +
          "NOW(), " +
          "NOW(), " +
          "'ash.ketchum@example.com', " +
          "'PXdKTZRuYpGiEclhq79oIdYl+E62Kdl4UW1DDDp++8Jw+XpX7YOgA7TJt9OQlqF4OtodOO/8zaFZFOzgW2WRYA==', " + // 'password'
          "'0taFsoQoTdl5JVPDGu9evA==', " +
          "'ash', " +
          "'3dba8270-87c0-4e76-b73e-aa900a4fe2be');"
        );
      })
      .then(() => {
        return queryInterface.sequelize.query(
          "INSERT INTO pokemon (" +
          "id, " +
          "\"createdAt\", " +
          "\"updatedAt\", " +
          "\"speciesId\", " +
          "level, " +
          "\"hitPointsValue\", " +
          "\"hitPointsIndividualValue\", " +
          "\"hitPointsEffortValue\", " +
          "\"attackValue\", " +
          "\"attackIndividualValue\", " +
          "\"attackEffortValue\", " +
          "\"defenseValue\", " +
          "\"defenseIndividualValue\", " +
          "\"defenseEffortValue\", " +
          "\"specialAttackValue\", " +
          "\"specialAttackIndividualValue\", " +
          "\"specialAttackEffortValue\", " +
          "\"specialDefenseValue\", " +
          "\"specialDefenseIndividualValue\", " +
          "\"specialDefenseEffortValue\", " +
          "\"speedValue\", " +
          "\"speedIndividualValue\", " +
          "\"speedEffortValue\", " +
          "\"moveIds\", " +
          "gender, " +
          "nature, " +
          "\"abilityId\", " +
          "\"trainerId\", " +
          "\"squadOrder\"," +
          "\"currentHitPoints\"," +
          "\"currentPowerPoints\") VALUES (" +
          "'01588c76-967f-4ea2-9fa7-7141c9c23a74', " +
          "NOW(), " +
          "NOW(), " +
          "1, " +
          "5, " +
          "21, 31, 0, " +
          "9, 15, 0, " +
          "11, 25, 0, " +
          "11, 8, 0, " +
          "12, 19, 0, " +
          "9, 0, 0, " +
          "'[33,45]', " +
          "2, " +
          "5, " +
          "65, " +
          "'3dba8270-87c0-4e76-b73e-aa900a4fe2be', " +
          "1, " +
          "21, " +
          "'[35,40]');"
        );
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      "DELETE FROM trainers WHERE id='3dba8270-87c0-4e76-b73e-aa900a4fe2be';"
    );
  }
};
