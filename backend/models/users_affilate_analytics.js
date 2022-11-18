"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users_affilate_analytics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users_affilate_analytics.init(
    {
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
    },
    {
      sequelize,
      modelName: "users_affilate_analytics",
    }
  );
  return users_affilate_analytics;
};
