"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class course_quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ quiz }) {
      // define association here
      this.hasMany(quiz, { as: "quizes", foreignKey: "course_quiz_id" });
    }
  }
  course_quiz.init(
    {
      course_quiz_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      course_id: {
        type: DataTypes.UUID,
      },
      heading: {
        type: DataTypes.STRING,
      },
      total_quizes: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "course_quizes",
      modelName: "course_quiz",
    }
  );
  return course_quiz;
};
