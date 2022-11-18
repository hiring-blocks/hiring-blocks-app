"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class course_teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Course, Teacher }) {
      // define association here
      Course.belongsToMany(Teacher, {
        through: course_teacher,
        as: "teachers",
        foreignKey: "course_id",
      });
      Teacher.belongsToMany(Course, {
        through: course_teacher,
        as: "courses",
        foreignKey: "teacher_id",
      });
    }
  }
  course_teacher.init(
    {
      course_teacher_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      appearance_order:{
        type: DataTypes.INTEGER
      },
    },
    {
      sequelize,
      tableName: "course_teachers",
      modelName: "course_teacher",
    }
  );
  return course_teacher;
};
