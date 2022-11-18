"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("quiz_questions", {
      quiz_question_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quiz_id: {
        type: DataTypes.UUID,
      },
      question: {
        type: DataTypes.STRING(8000),
      },
      option1: {
        type: DataTypes.STRING(8000),
      },
      option2: {
        type: DataTypes.STRING(8000),
      },
      option3: {
        type: DataTypes.STRING(8000),
      },
      option4: {
        type: DataTypes.STRING(8000),
      },
      question_img: {
        type: DataTypes.STRING(8000),
      },
      option1_img: {
        type: DataTypes.STRING(8000),
      },
      option2_img: {
        type: DataTypes.STRING(8000),
      },
      option3_img: {
        type: DataTypes.STRING(8000),
      },
      option4_img: {
        type: DataTypes.STRING(8000),
      },
      answer: {
        type: DataTypes.STRING(8000),
      },
      appearance_order: DataTypes.INTEGER,
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
    await queryInterface.dropTable("quiz_questions");
  },
};
