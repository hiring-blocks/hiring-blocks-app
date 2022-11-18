"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Chapter }) {
      // define association here
      this.hasMany(Chapter, { as: "chapters", foreignKey: "module_id" });
    }
  }
  Module.init(
    {
      module_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      module_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: DataTypes.STRING,
      description: DataTypes.STRING,
      appearance_order: DataTypes.INTEGER,
      demo_src: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "modules",
      modelName: "Module",
    }
  );
  return Module;
};
