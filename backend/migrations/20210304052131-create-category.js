"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("category", {
      category_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_type: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
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
    await queryInterface.dropTable("category");
  },
};
