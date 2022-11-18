"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ quiz_questions }) {
      // define association here
      this.hasMany(quiz_questions, { foreignKey: "quiz_id" });
    }
  }
  quiz.init(
    {
      quiz_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      course_quiz_id: {
        type: DataTypes.UUID,
      },
      quiz_name: {
        type: DataTypes.STRING,
      },
      total_questions: {
        type: DataTypes.STRING,
      },
      total_marks: {
        type: DataTypes.STRING,
      },
      total_time: {
        type: DataTypes.STRING,
      },
      appearance_order: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "quizes",
      modelName: "quiz",
    }
  );
  return quiz;
};
