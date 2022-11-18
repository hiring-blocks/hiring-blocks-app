"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_chapter_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_chapter_history.init(
    {
      user_chapter_history_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      course_id: DataTypes.UUID,
      module_id: DataTypes.UUID,
      chapter_id: DataTypes.UUID,
      user_id: DataTypes.UUID,
      percentage_watched: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user_chapter_history",
    }
  );
  return user_chapter_history;
};
