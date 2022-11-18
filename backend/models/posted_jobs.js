"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class posted_jobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ company }) {
      // define association here
      this.hasMany(company, { as: "company", foreignKey: "company_id" });
    }
  }
  posted_jobs.init(
    {
      job_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      job_title: DataTypes.STRING,
      job_description: DataTypes.STRING,
      job_type: DataTypes.STRING,
      experience_level: DataTypes.STRING,
      working_hours: {
        type: DataTypes.STRING,
      },
      salary: {
        type: DataTypes.STRING,
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
      workplace: {
        type: DataTypes.STRING,
      },
      job_location: {
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
      job_status: DataTypes.STRING,
      deadline: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "posted_jobs",
    }
  );
  return posted_jobs;
};
