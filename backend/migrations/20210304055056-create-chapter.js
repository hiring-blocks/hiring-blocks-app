"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("chapters", {
      chapter_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      chapter_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      video_src: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      appearance_order: DataTypes.INTEGER,
      module_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
    await queryInterface.dropTable("chapters");
  },
};
