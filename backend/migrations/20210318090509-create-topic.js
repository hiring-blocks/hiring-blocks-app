"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("topics", {
      topic_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      course_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      total_videos: DataTypes.STRING,
      topic_name: {
        type: DataTypes.STRING,
      },
      duration: DataTypes.STRING,
      topic_info:{
        type:DataTypes.STRING
      },
      demo_src: DataTypes.STRING,
      appearance_order: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable("topics");
  },
};
