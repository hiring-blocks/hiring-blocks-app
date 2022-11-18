"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class lecture_record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  lecture_record.init(
    {
      lecture_record_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: DataTypes.UUID,
      last_module_id: DataTypes.UUID,
      last_chapter_id: DataTypes.UUID,
      course_id: DataTypes.UUID,
      chapter_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "lecture_record",
    }
  );
  return lecture_record;
};
