"use strict";
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("messages", {
      message_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      message: {
        type: DataTypes.STRING,
      },
      job_id: {
        type: DataTypes.UUID,
      },
      sender: DataTypes.UUID,
      receiver: DataTypes.UUID,
      created_at: {
        allowNull: false,
        defaultValue: DataTypes.CURRENT_TIMESTAMP,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        defaultValue: DataTypes.CURRENT_TIMESTAMP,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("messages");
  },
};
