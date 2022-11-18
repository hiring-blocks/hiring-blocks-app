const {
  sequelize,
  admin_users,
  user,
  user_history,
  Course,
  Category,
  Module,
  Faq,
  Chapter,
  Teacher,
  Why_join,
  Topic,
  course_teacher,
  order_courses,
  users_affilate_analytics,
  redeem_request,
  user_chapter_history,
  lecture_record,
  user_course_percentage,
  user_quiz_scores,
  user_quiz_scores_history,
  course_quiz,
  quiz,
  quiz_questions,
  discount_coupon,
  discount_coupon_history,
} = require("../models");
const Op = require("sequelize").Op;
const otp = require("../utils/admin_otp.js");




class google_sheet_Controller {
  async all_users(req, res) {
    // const { user_id, password } = req.body;
    try {
      const all_users = await user.findAll({
        attributes: { exclude: ["notification_token", "token", "otp","users_total_clicks","total_unique_visitors","commission","device","ip_address"] },
        order: [["createdAt"]],
        raw: true,
      });
      if (!all_users) {
        return res.json({
          status: "failure",
          msg: "No Course Found!",
        });
      } else {
        return res.json({
          all_users,
          // data,
        });
      }

    } catch (err) {
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }

  }

}

module.exports = new google_sheet_Controller();
