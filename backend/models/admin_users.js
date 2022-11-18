"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class admin_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admin_users.init(
    {
      admin_users_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      type: DataTypes.STRING,
      email: DataTypes.STRING,
      otp: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "admin_users",
      modelName: "admin_users",
    }
  );
  return admin_users;
};
