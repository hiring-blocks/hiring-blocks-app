"use strict";
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("applied_jobs", {
      applied_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      job_id: DataTypes.UUID,
      user_id: DataTypes.UUID,
      selection_status: DataTypes.STRING,
      experience: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      additional_question: {
        type: DataTypes.JSONB,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      resume: {
        type: DataTypes.STRING,
      },
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
    await queryInterface.dropTable("applied_jobs");
  },
};
