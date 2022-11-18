"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class quiz_questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  quiz_questions.init(
    {
      quiz_question_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quiz_id: {
        type: DataTypes.UUID,
      }
      ,
      question: {
        type: DataTypes.STRING,
      },
      option1: {
        type: DataTypes.STRING,
      },
      option2: {
        type: DataTypes.STRING,
      },
      option3: {
        type: DataTypes.STRING,
      },
      option4: {
        type: DataTypes.STRING,
      },
      question_img: {
        type: DataTypes.STRING,
      },
      option1_img: {
        type: DataTypes.STRING,
      },
      option2_img: {
        type: DataTypes.STRING,
      },
      option3_img: {
        type: DataTypes.STRING,
      },
      option4_img: {
        type: DataTypes.STRING,
      },
      answer: {
        type: DataTypes.STRING,
      },
      appearance_order: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "quiz_questions",
    }
  );
  return quiz_questions;
};
