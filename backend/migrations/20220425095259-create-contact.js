"use strict";
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("contacts", {
      contact_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      subject: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        Default: DataTypes.CURRENT_TIMESTAMP,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        Default: DataTypes.CURRENT_TIMESTAMP,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("contacts");
  },
};
