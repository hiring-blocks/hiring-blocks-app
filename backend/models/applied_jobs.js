"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class applied_jobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ posted_jobs, user }) {
      // define association here
      this.hasMany(posted_jobs, { as: "posted_jobs", foreignKey: "job_id" });
      this.hasMany(user, { as: "user", foreignKey: "user_id" });
    }
  }
  applied_jobs.init(
    {
      applied_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
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
    },

    {
      sequelize,
      modelName: "applied_jobs",
    }
  );
  return applied_jobs;
};
