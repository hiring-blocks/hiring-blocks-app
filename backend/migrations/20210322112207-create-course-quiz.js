"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("course_quizes", {
      course_quiz_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      course_id: {
        type: DataTypes.UUID,
        // allowNull: false,
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
    await queryInterface.dropTable("course_quizes");
  },
};
