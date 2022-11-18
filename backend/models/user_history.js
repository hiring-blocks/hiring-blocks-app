"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_history.init(
    {
      user_history_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      full_name: DataTypes.STRING,
      mobile_no: DataTypes.STRING,
      device: DataTypes.STRING,
      ip_address: DataTypes.STRING,
      time: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "user_history",
      modelName: "user_history",
    }
  );
  return user_history;
};
