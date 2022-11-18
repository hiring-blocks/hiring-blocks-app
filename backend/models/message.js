"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ posted_jobs }) {
      this.hasMany(posted_jobs, { as: "posted_jobs", foreignKey: "job_id" });
      // define association here
    }
  }
  message.init(
    {
      message_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sender: DataTypes.UUID,
      receiver: DataTypes.UUID,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "message",
    }
  );
  return message;
};
