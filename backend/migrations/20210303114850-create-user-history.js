"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("user_history", {
      user_history_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      full_name: {
        type: DataTypes.STRING,
      },
      mobile_no: {
        type: DataTypes.STRING,
      },
      device: {
        type: DataTypes.STRING,
      },
      ip_address: {
        type: DataTypes.STRING,
      },
      time: {
        type: DataTypes.STRING,
      },
      type: {
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
    await queryInterface.dropTable("user_history");
  },
};
