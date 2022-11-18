"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Why_join extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Why_join.init(
    {
      why_join_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      appearance_order:{
        type: DataTypes.INTEGER,
      },
      answer: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      
    },
    {
      sequelize,
      tableName: "why_join",
      modelName: "Why_join",
    }
  );
  return Why_join;
};
