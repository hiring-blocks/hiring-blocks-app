"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("courses", {
      course_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      course_name: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_desc: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_duration: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_ratings: {
        type: DataTypes.DataTypes.STRING(8000),
        allowNull: false,
      },
      enrolled_students: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_lec: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_thumb_img: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_img: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_video_url: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      state_logo: {
        type: DataTypes.STRING(8000),
      },
      course_join_img: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_sale_price: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_base_price: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      course_state: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      category_type: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      total_video: {
        type: DataTypes.STRING,
      },
      course_code: {
        type: DataTypes.STRING(8000),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(8000),
        allowNull: false,
        defaultValue: "Active",
      },
      what_u_get: {
        type: DataTypes.STRING(8000),
        // allowNull: false,
      },
      checkout_desc: {
        type: DataTypes.STRING(8000),
      },
      telegram_grp: {
        type: DataTypes.STRING(8000),
      },
      page_title: {
        type: DataTypes.STRING(8000),
      },
      meta_desc: {
        type: DataTypes.STRING(8000),
      },
      checkout_page_title: {
        type: DataTypes.STRING(8000),
      },
      checkout_meta_desc: {
        type: DataTypes.STRING(8000),
      },
      mock_test: {
        type: DataTypes.STRING(8000),
      },
      examination_date: {
        type: DataTypes.STRING(8000),
      },
      live_session_date: {
        type: DataTypes.STRING(8000),
      },
      what_u_get_with_course_heading: {
        type: DataTypes.STRING(8000),
      },
      what_u_get_with_course_1: {
        type: DataTypes.STRING(8000),
      },
      what_u_get_with_course_2: {
        type: DataTypes.STRING(8000),
      },
      what_u_get_with_course_3: {
        type: DataTypes.STRING(8000),
      },
      what_u_get_with_course_4: {
        type: DataTypes.STRING(8000),
      },
      what_u_get_join_heading: {
        type: DataTypes.STRING(8000),
      },
      exam_prep_heading: {
        type: DataTypes.STRING(8000),
      },
      syllabus_section_heading: {
        type: DataTypes.STRING(8000),
      },
      what_u_get_heading: {
        type: DataTypes.STRING(8000),
      },
      checkout_unlocking_point1: {
        type: DataTypes.STRING(8000),
      },
      checkout_unlocking_point2: {
        type: DataTypes.STRING(8000),
      },
      checkout_unlocking_point3: {
        type: DataTypes.STRING(8000),
      },
      checkout_unlocking_point4: {
        type: DataTypes.STRING(8000),
      },
      checkout_endline: {
        type: DataTypes.STRING(8000),
      },

	total_video: {
        type: DataTypes.STRING,
      },

      appearance_order:{
        type: DataTypes.INTEGER
        // allowNull: false,
        // defaultValue: "Active",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("courses");
  },
};
