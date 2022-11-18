"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("quizes", {
      quiz_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      course_quiz_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quiz_name: {
        type: DataTypes.STRING,
      },
      total_marks: {
        type: DataTypes.STRING,
      },
      total_questions: {
        type: DataTypes.STRING,
      },
      total_time: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable("quizes");
  },
};
