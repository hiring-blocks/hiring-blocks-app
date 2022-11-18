"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Topic, Faq, Why_join, course_quiz }) {
      // define association here
      
      this.hasMany(Why_join, { as: "why_joins", foreignKey: "course_id" });
      this.hasMany(Topic, { as: "topics", foreignKey: "course_id" });
      this.hasMany(Faq, { as: "faqs", foreignKey: "course_id" });
      this.hasMany(course_quiz, {
        as: "course_quizes",
        foreignKey: "course_id",
      });
      // this.belongsToMany(Teacher, {
      //   through: "course_teacher",
      //   foreignKey: "ref_id",
      // });
    }
  }
  Course.init(
    {
      course_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      course_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_desc: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      course_duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_ratings: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      enrolled_students: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_lec: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_thumb_img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_video_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_join_img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_sale_price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_base_price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      what_u_get: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      checkout_desc: {
        type: DataTypes.STRING,
      },
      telegram_grp: {
        type: DataTypes.STRING,
      },
      page_title: {
        type: DataTypes.STRING,
      },
      meta_desc: {
        type: DataTypes.STRING,
      },
      checkout_page_title: {
        type: DataTypes.STRING,
      },
      checkout_meta_desc: {
        type: DataTypes.STRING,
      },
      state_logo: {
        type: DataTypes.STRING,
      },
      mock_test: {
        type: DataTypes.STRING,
      },
      examination_date: {
        type: DataTypes.STRING,
      },
      live_session_date: {
        type: DataTypes.STRING,
      },
      what_u_get_with_course_heading: {
        type: DataTypes.STRING,
      },
      what_u_get_with_course_1: {
        type: DataTypes.STRING,
      },
      what_u_get_with_course_2: {
        type: DataTypes.STRING,
      },
      what_u_get_with_course_3: {
        type: DataTypes.STRING,
      },
      what_u_get_with_course_4: {
        type: DataTypes.STRING,
      },
      what_u_get_join_heading: {
        type: DataTypes.STRING,
      },
      exam_prep_heading: {
        type: DataTypes.STRING,
      },
      syllabus_section_heading: {
        type: DataTypes.STRING,
      },
      what_u_get_heading: {
        type: DataTypes.STRING,
      },
      checkout_unlocking_point1: {
        type: DataTypes.STRING,
      },
      checkout_unlocking_point2: {
        type: DataTypes.STRING,
      },
      checkout_unlocking_point3: {
        type: DataTypes.STRING,
      },
      checkout_unlocking_point4: {
        type: DataTypes.STRING,
      },
      checkout_endline: {
        type: DataTypes.STRING,
      },
	total_video: {
        type: DataTypes.STRING,
      },
      appearance_order:{
        type: DataTypes.INTEGER
        // allowNull: false,
        // defaultValue: "Active",
      },
    },
    {
      sequelize,
      tableName: "courses",
      modelName: "Course",
    }
  );
  return Course;
};
