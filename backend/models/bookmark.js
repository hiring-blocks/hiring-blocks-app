"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bookmark extends Model {
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
  bookmark.init(
    {
      bookmark_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "bookmark",
    }
  );
  return bookmark;
};
