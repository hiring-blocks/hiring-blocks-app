"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Course }) {
      // define association here
      // this.belongsToMany(Course, {
      //   through: "course_teacher",
      //   foreignKey: "teacher_id",
      // });
    }
  }
  Teacher.init(
    {
      teacher_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      prof_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prof_desc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prof_img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "teachers",
      modelName: "Teacher",
    }
  );
  return Teacher;
};
