"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ chapter_quiz }) {
      // define association here
      // this.hasOne(chapter_quiz, { foreignKey: "chapter_id" });
    }
  }
  Chapter.init(
    {
      chapter_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      chapter_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      video_src: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      appearance_order: DataTypes.INTEGER,
      duration: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING(1000),
      },
    },
    {
      sequelize,
      tableName: "chapters",
      modelName: "Chapter",
    }
  );
  return Chapter;
};
