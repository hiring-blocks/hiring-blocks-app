"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("lecture_records", {
      lecture_record_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      total_no_videos: DataTypes.INTEGER,
      total_no_watched_videos: DataTypes.INTEGER,
      percentage_watched: DataTypes.INTEGER,
      user_id: DataTypes.UUID,
      last_module_id: DataTypes.UUID,
      last_chapter_id: DataTypes.UUID,
      course_id: DataTypes.UUID,
      chapter_name: DataTypes.STRING,

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
    await queryInterface.dropTable("lecture_records");
  },
};
