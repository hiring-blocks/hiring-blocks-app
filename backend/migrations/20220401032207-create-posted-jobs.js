"use strict";
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("posted_jobs", {
      job_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      company_id: DataTypes.UUID,
      job_title: {
        type: DataTypes.STRING,
      },
      job_description: {
        type: DataTypes.STRING,
      },
      job_type: {
        type: DataTypes.STRING,
      },
      experience_level: {
        type: DataTypes.STRING,
      },
      job_status: {
        type: DataTypes.STRING,
      },
      workplace: {
        type: DataTypes.STRING,
      },
      job_location: {
        type: DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.CURRENT_TIMESTAMP,
      },
      working_hours: {
        type: DataTypes.STRING,
      },
      salary: {
        type: DataTypes.String,
      },
      skilles_required: {
        type: DataTypes.JSONB,
      },
      responsibilities: {
        type: DataTypes.STRING,
      },
      qualification: {
        type: DataTypes.STRING,
      },
      application_end_date: {
        type: DataTypes.STRING,
      },
      deadline: {
        type: DataTypes.STRING,
      },
      question1: {
        type: DataTypes.STRING,
      },
      question2: {
        type: DataTypes.STRING,
      },
      no_of_opening: {
        type: DataTypes.INTEGER,
      },
      job_or_internship: {
        type: DataTypes.STRING,
      },
      updated_at: {
        allowNull: false,
        defaultValue: DataTypes.CURRENT_TIMESTAMP,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("posted_jobs");
  },
};
