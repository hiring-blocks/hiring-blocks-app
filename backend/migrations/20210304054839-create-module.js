"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("modules", {
      module_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      module_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      topic_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      appearance_order: DataTypes.INTEGER,
      demo_src: DataTypes.STRING,
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
    await queryInterface.dropTable("modules");
  },
};
