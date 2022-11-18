"use strict";
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("bookmarks", {
      bookmark_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      job_id: DataTypes.UUID,
      user_id: DataTypes.UUID,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.CURRENT_TIMESTAMP,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: DataTypes.CURRENT_TIMESTAMP,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("bookmarks");
  },
};
