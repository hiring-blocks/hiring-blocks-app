"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("users_affilate_analytics", {
      users_affilate_analytics_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: DataTypes.STRING,
      user_referral_code: DataTypes.STRING,
      course_id: DataTypes.UUID,
      number_of_clicks: DataTypes.BIGINT,
      unique_visitors: DataTypes.BIGINT,
      email: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("users_affilate_analytics");
  },
};
