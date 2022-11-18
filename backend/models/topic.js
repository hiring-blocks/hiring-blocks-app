"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Module }) {
      // define association here
      this.hasMany(Module, { as: "sub_topics", foreignKey: "topic_id" });
    }
  }
  Topic.init(
    {
      topic_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      total_videos: DataTypes.STRING,
      appearance_order: {
        type: DataTypes.INTEGER,
      },
      topic_name: {
        type: DataTypes.STRING,
      },
      duration: DataTypes.STRING,
      topic_info:{
        type:DataTypes.STRING
      },
      demo_src: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "topics",
      modelName: "Topic",
    }
  );
  return Topic;
};
