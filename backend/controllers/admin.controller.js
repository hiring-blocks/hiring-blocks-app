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
  demo_discount_coupon,
  cart_items,
} = require("../models");
const Op = require("sequelize").Op;
const bucket = require("../config/gcp");
const keys = require("../config/keys.json");
const rimraf = require("rimraf");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");
const fs = require("fs");
const fse = require("fs-extra");
ffmpeg.setFfprobePath("/usr/bin/ffprobe");
const { sendMail } = require("../utils/admin_otp.js");

class AdminController {
  async loginAdmin(req, res) {
    const { username, password } = req.query;
    try {
      const User = await admin_users.findOne({
        attributes: { exclude: ["createdAt", "updatedAt", "otp"] },
        where: {
          username,
        },
      });
      if (!User) {
        return res.json({
          status: "failure",
          msg: "User does not Exist!",
        });
      } else {
        if (User.password == password) {
          const email = User.email;
          console.log("Email: " + email);
          const send_otp_status = await sendMail(email);
          console.log(send_otp_status);
          return res.json({
            status: "success",
            User,
          });
        } else {
          return res.json({
            status: "failure",
            msg: "Incorrect Password!",
          });
        }
      }
    } catch (err) {
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }
  async addAdmin(req, res) {
    const { username, password, type, email } = req.body;
    try {
      const User = await admin_users.findOne({
        where: {
          username,
        },
      });
      if (User) {
        return res.json({
          status: "failure",
          msg: "User with this username already Exist!",
        });
      } else {
        const Newuser = await admin_users.create({
          username,
          password,
          type,
          email,
        });
        return res.json({
          status: "success",
          Newuser,
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

  async userinfo(req, res) {
    const { user_id } = req.query;
    try {
      const User = await admin_users.findOne({
        where: {
          admin_users_id: user_id,
        },
      });
      if (!User) {
        return res.json({
          status: "failure",
          msg: "No User Found!",
        });
      } else {
        return res.json({
          status: "success",
          User,
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

  async changepassword(req, res) {
    const { user_id, password, otp } = req.body;
    try {
      const User = await admin_users.findOne({
        where: {
          admin_users_id: user_id,
        },
      });
      if (!User) {
        return res.json({
          status: "failure",
          msg: "No User Found!",
        });
      } else {
        if (User.otp == otp) {
          User.password = password;
          await User.save();
          return res.json({
            status: "success",
            msg: "Password Updated!",
            User,
            // data,
          });
        } else {
          return res.json({
            status: "failure",
            msg: "Incorrect OTP!",
            // data,
          });
        }
      }
    } catch (err) {
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }

  async allcourses(req, res) {
    // const { user_id, password } = req.body;
    try {
      const allcourses = await Course.findAll({
        order: [["appearance_order", "ASC"]],
        raw: true,
      });
      if (!allcourses) {
        return res.json({
          status: "failure",
          msg: "No Course Found!",
        });
      } else {
        return res.json({
          status: "success",
          allcourses,
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

  async alltopics(req, res) {
    // const { course_id } = req.body;
    try {
      const alltopics = await Topic.findAll({
        // where: {
        //   course_id,
        // },
        order: [
          ["appearance_order", "ASC"],
          [{ model: Module, as: "sub_topics" }, "appearance_order", "ASC"],
          [
            { model: Module, as: "sub_topics" },
            { model: Chapter, as: "chapters" },
            "appearance_order",
            "ASC",
          ],
        ],
        include: [
          {
            model: Module,
            as: "sub_topics",
            // attributes: [
            //   "module_id",
            //   "module_name",
            //   "duration",
            //   "description",
            // ],
            include: [
              {
                model: Chapter,
                as: "chapters",
                // attributes: [
                //   "chapter_id",
                //   "chapter_name",
                //   "duration",
                //   "description",
                // ],
              },
            ],
          },
        ],
        // raw: true,
      });
      if (!alltopics) {
        return res.json({
          status: "failure",
          msg: "No Course Found!",
        });
      } else {
        return res.json({
          status: "success",
          alltopics,
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

  async allsubtopics(req, res) {
    // const { topic_id } = req.body;
    try {
      const allmodule = await Module.findAll({
        // where: {
        //   topic_id,
        // },
        order: [
          ["appearance_order", "ASC"],
          [{ model: Chapter, as: "chapters" }, "appearance_order", "ASC"],
        ],
        include: [
          {
            model: Chapter,
            as: "chapters",
          },
        ],
        // raw: true,
      });
      if (!allmodule) {
        return res.json({
          status: "failure",
          msg: "No Course Found!",
        });
      } else {
        return res.json({
          status: "success",
          allmodule,
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

  async allchapters(req, res) {
    // const { module_id } = req.body;
    try {
      const allChapter = await Chapter.findAll({
        // where: {
        //   module_id,
        // },
        order: [["appearance_order", "ASC"]],
        // raw: true,
      });
      if (!allChapter) {
        return res.json({
          status: "failure",
          msg: "No Course Found!",
        });
      } else {
        return res.json({
          status: "success",
          allChapter,
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

  async admin_otp_verfication(req, res) {
    const { username, otp } = req.query;
    try {
      const User = await admin_users.findOne({
        attributes: { exclude: ["createdAt", "updatedAt", "otp", "password"] },
        where: {
          username,
          otp,
        },
      });
      if (!User) {
        return res.json({
          status: "failure",
          msg: "Incorrect OTP!",
        });
      } else {
        return res.json({
          status: "success",
          User,
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

  async all_orders(req, res) {
    // const { user_id, password } = req.body;
    try {
      const all_orders = await order_courses.findAll({
        order: [["date_now"]],
        raw: true,
      });
      if (!all_orders) {
        return res.json({
          status: "failure",
          msg: "No Course Found!",
        });
      } else {
        return res.json({
          status: "success",
          all_orders,
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

  async all_users(req, res) {
    // const { user_id, password } = req.body;
    try {
      const all_users = await user.findAll({
        attributes: { exclude: ["notification_token", "token", "otp"] },
        order: [["time"]],
        raw: true,
      });
      if (!all_users) {
        return res.json({
          status: "failure",
          msg: "No Course Found!",
        });
      } else {
        return res.json({
          status: "success",
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

  async single_course(req, res) {
    const { course_id } = req.query;
    try {
      const courseData = await Course.findOne({
        where: {
          course_id,
        },
        order: [
          [{ model: Topic, as: "topics" }, "appearance_order", "ASC"],
          [
            { model: Topic, as: "topics" },
            { model: Module, as: "sub_topics" },
            "appearance_order",
            "ASC",
          ],
          [
            { model: Topic, as: "topics" },
            { model: Module, as: "sub_topics" },
            { model: Chapter, as: "chapters" },
            "appearance_order",
            "ASC",
          ],
        ],
        attributes: [
          "course_id",
          "course_name",
          "course_desc",
          "course_thumb_img",
          "course_img",
          "course_join_img",
          "course_ratings",
          "course_duration",
          "enrolled_students",
          "course_sale_price",
          "course_base_price",
          "course_video_url",
          "course_state",
          "course_lec",
          "category_type",
          "course_code",
          "telegram_grp",
        ],
        include: [
          {
            model: Topic,
            as: "topics",
            // attributes: [
            //   "topic_id",
            //   "topic_name",
            //   "duration",
            //   ["total_videos", "totalVideos"],
            // ],
            include: [
              {
                model: Module,
                as: "sub_topics",
                // attributes: [
                //   "module_id",
                //   "module_name",
                //   "duration",
                //   "description",
                // ],
                include: [
                  {
                    model: Chapter,
                    as: "chapters",
                    // attributes: [
                    //   "chapter_id",
                    //   "chapter_name",
                    //   "duration",
                    //   "description",
                    // ],
                  },
                ],
              },
            ],
          },
          // {
          //   model: course_quiz,
          //   as: "course_quizes",
          //   attributes: { exclude: ["createdAt", "updatedAt"] },
          //   include: [
          //     {
          //       model: quiz,
          //       as: "quizes",
          //       attributes: { exclude: ["createdAt", "updatedAt"] },
          //     },
          //   ],
          // },
        ],
      });
      if (!courseData) {
        return res.json({
          status: "failure",
          msg: "No Course Found!",
        });
      } else {
        return res.json({
          status: "success",
          courseData,
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

  async add_cart_item(req, res) {
    const { user_id, course_id } = req.body;
    try {
      const User = await cart_items.findOne({
        where: {
          user_id,
          course_id,
        },
      });
      if (User) {
        return res.json({
          status: "failure",
          msg: "Already added to Cart!",
        });
      } else {
        const Newuser = await cart_items.create({
          user_id,
          course_id,
        });
        return res.json({
          status: "success",
          msg: "Added to Cart!",
          Newuser,
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

  async get_cart_item(req, res) {
    const { user_id } = req.query;
    try {
      const User = await cart_items.findAll({
        where: {
          user_id,
        },
      });
      console.log(User.length);
      if (User.length > 0) {
        const courseData = await Course.findAll({
          where: {
            // [Op.or]: orderData,
            // course_id: User.map((item) => item.course_id)
            [Op.or]: { course_id: User.map((item) => item.course_id) },
          },
          order: [["appearance_order", "ASC"]],
          attributes: [
            "course_id",
            "course_name",
            "course_thumb_img",
            "course_ratings",
            "course_duration",
            "enrolled_students",
            "course_sale_price",
            "course_base_price",
            "category_type",
            "course_lec",
            "mock_test",
            "examination_date",
            "live_session_date",
            "state_logo",
            "appearance_order",
          ],
          // raw: true,
        });

        return res.json({
          status: "success",
          courseData,
        });
      } else {
        return res.json({
          status: "failure",
          msg: "Cart is empty!",
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

  async del_cart_item(req, res) {
    const { user_id, course_id } = req.body;
    try {
      const User = await cart_items.findOne({
        where: {
          user_id,
          course_id,
        },
      });
      if (User) {
        await User.destroy();
        return res.json({
          status: "success",
          msg: "Deleted!",
        });
      } else {
        return res.json({
          status: "failure",
          msg: "Item is not Added!",
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

  async call_otp(req, res) {
    const { username } = req.body;
    try {
      const User = await admin_users.findOne({
        attributes: { exclude: ["createdAt", "updatedAt", "otp"] },
        where: {
          username,
        },
      });
      if (!User) {
        return res.json({
          status: "failure",
          msg: "User does not Exist!",
        });
      } else {
        const email = User.email;
        const send_otp_status = await sendMail(email);
        console.log(send_otp_status);
        return res.json({
          status: "success",
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

  async enter_discount_coupon(req, res) {
    const { course_id, coupon_name, flat } = req.body;
    try {
      var coupon_name_upper_case = coupon_name.toUpperCase();
      let courseData = await Course.findOne({
        where: {
          course_id,
        },
        attributes: ["course_name"],
        raw: true,
      });
      if (!courseData) {
        return res.json({
          status: "failure",
          message: "Invalid Course ID!",
        });
      }
      const results = await demo_discount_coupon.findOne({
        where: {
          coupon_name: coupon_name_upper_case,
          course_id,
        },
        attributes: ["coupon_name", "course_id", "flat"],
        raw: true,
      });
      if (results) {
        return res.json({
          status: "failure",
          message: "This Coupon is already created for this Course",
        });
      }
      const user = await demo_discount_coupon.create({
        course_id,
        coupon_name: coupon_name_upper_case,
        flat,
        course_name: courseData.course_name,
      });
      const coupon_history = await discount_coupon_history.create({
        course_id,
        coupon_name: coupon_name_upper_case,
        flat,
        course_name: courseData.course_name,
      });
      return res.json({
        status: "success",
        user,
        // data,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: "failure",
        message: "Some technical error",
      });
    }
  }

  async update_discount_coupon(req, res) {
    const { course_id, coupon_name, flat } = req.body;
    try {
      var coupon_name_upper_case = coupon_name.toUpperCase();
      const results = await demo_discount_coupon.findOne({
        where: {
          coupon_name: coupon_name_upper_case,
          course_id,
        },
        // attributes: [
        //   "coupon_name",
        //   "course_id",
        //   "flat",
        // ],
        // raw: true,
      });
      if (!results) {
        return res.json({
          status: "failure",
          message:
            "Coupon not Found! Please add coupon or check coupon name and course Id.",
        });
      }
      results.flat = flat;

      await results.save();
      return res.json({
        status: "success",
        results,
        // data,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: "failure",
        message: "Some technical error",
      });
    }
  }

  async delete_discount_coupon(req, res) {
    const { course_id, coupon_name } = req.body;
    try {
      var coupon_name_upper_case = coupon_name.toUpperCase();
      const results = await demo_discount_coupon.findOne({
        where: {
          coupon_name: coupon_name_upper_case,
          course_id,
        },
      });
      if (!results) {
        return res.json({
          status: "failure",
          message:
            "Coupon not Found! Please add coupon or check coupon name and course Id.",
        });
      }

      await results.destroy();
      return res.json({
        status: "success",
        // data,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: "failure",
        message: "Some technical error",
      });
    }
  }

  async fetch_discount_coupon(req, res) {
    try {
      const results = await demo_discount_coupon.findAll({});
      if (!results || results.length < 1) {
        return res.json({
          status: "failure",
          message: "No coupon found!",
        });
      }
      // var amount = Number(courseData.course_sale_price) - Number(results.flat)
      return res.json({
        status: "Success",
        data: results,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: "failure",
        message: "Some technical error",
      });
    }
  }
  async add_why_join(req, res) {
    const { question, answer, course_id } = req.body;
    try {
      let latestAppearanceOrder = await Why_join.max("appearance_order", {
        where: { course_id },
      });

      if (!latestAppearanceOrder) latestAppearanceOrder = 0;

      const courseData = await Course.findOne({
        where: { course_id },
      });

      if (!courseData) {
        return res.json({
          status: "failure",
          msg: "No valid course selected",
        });
      } else {
        const newWhyJoin = await Why_join.create({
          question,
          answer,
          course_id,
          appearance_order: latestAppearanceOrder + 1,
        });
        return res.json({
          status: "success",
          data: newWhyJoin,
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }
  async get_why_joins(req, res) {
    try {
      // const {course_id} = req.query;
      const whyJoinQues = await Why_join.findAll({
        // where: { course_id }
      });

      if (!whyJoinQues) {
        return res.json({
          status: "failure",
          msg: "No why join questions available",
        });
      } else {
        return res.json({
          status: "success",
          data: whyJoinQues,
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }
  async update_why_join(req, res) {
    const { why_join_id, question, answer } = req.body;
    // console.log(userId);
    try {
      const whyJoin = await Why_join.findOne({
        where: { why_join_id },
      });

      if (whyJoin) {
        whyJoin.question = question;
        whyJoin.answer = answer;

        await whyJoin.save();
        return res.json({
          status: "success",
          whyJoin,
          // data,
        });
      } else {
        return res.json({
          status: "failure",
          msg: "no matching why_join found!",
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
  async del_why_join(req, res) {
    const { why_join_id } = req.body;
    try {
      const whyJoin = await Why_join.findOne({
        where: { why_join_id },
      });

      if (!whyJoin) {
        return res.json({
          status: "failure",
          msg: "Invalid why join question",
        });
      } else {
        await whyJoin.destroy();
        return res.json({
          status: "success",
          msg: `Deletion successful`,
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }

  async order_details(req, res) {
    try {
      const allOrders = await order_courses.count();
      console.log(allOrders);

      const paidOrders = await order_courses.count({
        where: { status: "Paid" },
      });
      console.log(paidOrders);

      const pendingOrders = await order_courses.count({
        where: { status: "Pending" },
      });
      console.log(pendingOrders);

      if (!allOrders) {
        return res.json({
          status: "failure",
          msg: "error in fetching order details",
        });
      } else {
        return res.json({
          status: "success",
          orderDetails: {
            total_orders: allOrders,
            pending_orders: pendingOrders,
            completed_orders: paidOrders,
          },
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }

  async getfaq(req, res) {
    try {
      let find = await Faq.findAll({
        raw: true,
      });

      res.json({
        status: "sucess",
        Data: find,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }

  async addfaq(req, res) {
    const { question, answer, course_id } = req.body;
    try {
      let latestAppearanceOrder = await Faq.max("appearance_order", {
        where: { course_id },
      });

      if (!latestAppearanceOrder) latestAppearanceOrder = 0;

      const courseData = await Course.findOne({
        where: { course_id },
      });

      if (!courseData) {
        return res.json({
          status: "failure",
          msg: "No valid course selected",
        });
      } else {
        const newFaq = await Faq.create({
          question,
          answer,
          course_id,
          appearance_order: latestAppearanceOrder + 1,
        });
        return res.json({
          status: "success",
          newFaq,
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }

  async updateFaq(req, res) {
    const { faq_id, question, answer } = req.body;
    // console.log(userId);
    try {
      const faq = await Faq.findOne({
        where: { faq_id },
      });

      if (faq) {
        faq.question = question;
        faq.answer = answer;

        await faq.save();
        return res.json({
          status: "success",
          faq,
          // data,
        });
      } else {
        return res.json({
          status: "failure",
          msg: "no matching faq found!",
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

  async deletefaq(req, res) {
    try {
      let { faq_id } = req.query;

      let find = await Faq.findOne({
        where: {
          faq_id: faq_id,
        },
      });
      if (find) {
        await find.destroy();
        await res.json({
          status: " success",
          msg: "FAQ Deleted!",
        });
      } else {
        res.json({
          status: "faqid not present ",
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }

  async getCourseDetail(req, res) {
    try {
      let find = await order_courses
        .findAll({
          attributes: ["order_courses_id", "amount", "product_id"],
          raq: true,
        })
        .then((Data) => {
          res.json({
            status: "success",
            fetchedData: Data,
          });
        });
    } catch (err) {
      res.json({
        status: failed,
        Error: err,
      });
    }
  }

  async revenueAnalytics(req, res) {
    try {
      let arr = [];

      let find = await order_courses
        .findAll({
          attributes: ["date_now"],
          raw: true,
        })
        .then(async (data) => {
          let jan = [];
          let feb = [];
          let mar = [];
          let apr = [];
          let may = [];
          let june = [];
          let july = [];
          let aug = [];
          let sept = [];
          let oct = [];
          let nov = [];
          let dec = [];

          for (let i = 0; i < data.length; i++) {
            let str = "" + data[i].date_now;
            let m = str.split(" ");

            if (m[1] == "Jan") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              jan.push(search);
            } else if (m[1] == "Feb") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              feb.push(search);
            } else if (m[1] == "Mar") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              mar.push(search);
            } else if (m[1] == "Apr") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              apr.push(search);
            } else if (m[1] == "May") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              may.push(search);
            } else if (m[1] == "June") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              june.push(search);
            } else if (m[1] == "July") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              july.push(search);
            } else if (m[1] == "Aug") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              aug.push(search);
            } else if (m[1] == "Sept") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              sept.push(search);
            } else if (m[1] == "Oct") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              oct.push(search);
            } else if (m[1] == "Nov") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              nov.push(search);
            } else if (m[1] == "Dec") {
              let { date_now } = data[i];

              let search = await order_courses.findOne({
                where: {
                  date_now: date_now,
                },
                attributes: ["product_id", "amount"],
                raw: true,
              });

              dec.push(search);
            }
          }

          function totalSale(month) {
            let totalCourse = month.length;

            let sum = 0;
            for (let i = 0; i < month.length; i++) {
              sum = sum + Number(month[i].amount);
            }
            return { totalCourseSale: totalCourse, totalAmount: sum };
          }
          res.json({
            status: "sucess",
            Jan: totalSale(jan),
            feb: totalSale(feb),
            mar: totalSale(mar),
            apr: totalSale(apr),
            may: totalSale(may),
            june: totalSale(june),
            july: totalSale(july),
            aug: totalSale(aug),
            sept: totalSale(sept),
            oct: totalSale(oct),
            nov: totalSale(nov),
            dec: totalSale(dec),
          });
        });
    } catch (err) {
      res.json({
        status: "Failed",
        Error: err,
      });
    }
  }

  async addtopic(req, res) {
    const {
      course_id,
      total_videos,
      topic_name,
      duration,
      demo_src,
      sub_topics,
    } = req.body;
    try {
      const latestAppearanceOrder = await Topic.max("appearance_order", {
        where: { course_id },
      });

      if (!latestAppearanceOrder) latestAppearanceOrder = 0;

      const course = await Course.findOne({
        where: { course_id },
      });

      if (!course) {
        return res.json({
          status: "failure",
          msg: "No course selected",
        });
      } else {
        const new_topic = await Topic.create({
          course_id,
          total_videos,
          topic_name,
          duration,
          demo_src,
          appearance_order: latestAppearanceOrder + 1,
        });

        const subTopics = await Promise.all(
          sub_topics.map(async (sub_topic, index) => {
            console.log(sub_topic);
            const stopic = await Module.update(
              {
                topic_id: new_topic.topic_id,
                appearance_order: index + 1,
              },
              {
                where: { module_id: sub_topic },
                plain: true,
                returning: true,
              }
            );

            return stopic;
          })
        );
        console.log(subTopics);

        return res.json({
          status: "success",
          new_topic,
          subTopics,
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

  async update_course(req, res) {
    const { course_id } = req.body;
    try {
      const courseData = await Course.update(req.body, {
        where: { course_id },
        returning: true,
        plain: true,
      });

      if (!courseData) {
        return res.json({
          status: "failure",
          msg: "Not a valid course",
        });
      } else {
        return res.json({
          status: "success",
          data: courseData[1],
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }

  async add_course(req, res) {
    const {
      course_name,
      course_desc,
      course_state,
      category_type,
      telegram_grp,
      course_code,
      course_duration,
      course_ratings,
      enrolled_students,
      course_thumb_img,
      course_img,
      course_lec,
      course_video_url,
      state_logo,
      course_join_img,
      meta_desc,
      examination_date,
      exam_prep_heading,
      live_session_date,
      what_u_get,
      what_u_get_heading,
      what_u_get_join_heading,
      what_u_get_with_course_1,
      what_u_get_with_course_2,
      what_u_get_with_course_3,
      what_u_get_with_course_4,
      what_u_get_with_course_heading,
      syllabus_section_heading,
      mock_test,
      course_sale_price,
      course_base_price,
      checkout_page_title,
      checkout_meta_desc,
      checkout_desc,
      checkout_unlocking_point1,
      checkout_unlocking_point2,
      checkout_unlocking_point3,
      checkout_unlocking_point4,
      checkout_endline,
      page_title,
    } = req.body;
    try {
      const latestAppearanceOrder = await Course.max("appearance_order");

      if (!latestAppearanceOrder) latestAppearanceOrder = 0;

      const newCourse = await Course.create({
        course_name,
        course_desc,
        course_state,
        category_type,
        telegram_grp,
        course_code,
        course_duration,
        course_ratings,
        enrolled_students,
        course_thumb_img,
        course_img,
        course_lec,
        course_video_url,
        state_logo,
        course_join_img,
        meta_desc,
        examination_date,
        exam_prep_heading,
        live_session_date,
        what_u_get,
        what_u_get_heading,
        what_u_get_join_heading,
        what_u_get_with_course_1,
        what_u_get_with_course_2,
        what_u_get_with_course_3,
        what_u_get_with_course_4,
        what_u_get_with_course_heading,
        syllabus_section_heading,
        mock_test,
        course_sale_price,
        course_base_price,
        checkout_page_title,
        checkout_meta_desc,
        checkout_desc,
        checkout_unlocking_point1,
        checkout_unlocking_point2,
        checkout_unlocking_point3,
        checkout_unlocking_point4,
        checkout_endline,
        page_title,
        appearance_order: latestAppearanceOrder + 1,
      });
      return res.json({
        status: "success",
        newCourse,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }

  async updatetopic(req, res) {
    const {
      topic_id,
      sub_topics,
      total_videos,
      topic_name,
      duration,
      demo_src,
    } = req.body;

    try {
      const topic = await Topic.update(
        {
          ...req.body,
          sub_topics: await Promise.all(
            sub_topics.map(async (sub_topic, index) => {
              console.log(sub_topic);
              const stopic = await Module.update(
                {
                  topic_id,
                  appearance_order: index + 1,
                },
                {
                  where: { module_id: sub_topic },
                  plain: true,
                  returning: true,
                }
              );

              return stopic;
            })
          ),
        },
        {
          where: { topic_id },
          returning: true,
          plain: true,
        }
      );

      if (!topic) {
        return res.json({
          status: "failure",
          msg: "Not a valid topic",
        });
      } else {
        return res.json({
          status: "success",
          topic,
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

  async addmodule(req, res) {
    const { topic_id, module_name, duration, description, demo_src, chapters } =
      req.body;

    try {
      const topic = await Topic.findOne({
        where: { topic_id },
      });

      const latestAppearanceOrder = await Module.max("appearance_order", {
        where: { topic_id },
      });

      if (!latestAppearanceOrder) latestAppearanceOrder = 0;

      if (!topic) {
        return res.json({
          status: "failure",
          msg: "No topic selected",
        });
      } else {
        const new_module = await Module.create({
          topic_id,
          module_name,
          duration,
          description,
          demo_src,
          appearance_order: latestAppearanceOrder + 1,
        });

        const Chapters = await Promise.all(
          chapters.map(async (chapter, index) => {
            console.log(chapter);
            const chap = await Chapter.update(
              {
                module_id: new_module.module_id,
                appearance_order: index + 1,
              },
              {
                where: { chapter_id: chapter },
                plain: true,
                returning: true,
              }
            );

            return chap;
          })
        );

        return res.json({
          status: "success",
          new_module,
          Chapters,
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

  async updatemodule(req, res) {
    const { module_id, chapters } = req.body;

    try {
      const module = await Module.update(
        {
          ...req.body,
          chapters: await Promise.all(
            chapters.map(async (chapter, index) => {
              console.log(chapter);
              const chap = await Chapter.update(
                {
                  module_id,
                  appearance_order: index + 1,
                },
                {
                  where: { chapter_id: chapter },
                  plain: true,
                  returning: true,
                }
              );

              return chap;
            })
          ),
        },
        {
          where: { module_id },
          returning: true,
          plain: true,
        }
      );

      if (!module) {
        return res.json({
          status: "failure",
          msg: "Not a valid module",
        });
      } else {
        return res.json({
          status: "success",
          updated: module,
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

  async monthly_analytics(req, res) {
    try {
      //gets paid orders
      const paidOrders = await order_courses.findAll({
        where: {
          status: "Paid",
        },
      });

      //gets all courses
      const courses = await Course.findAll();

      //callback function to map on courses
      //returns object with course sale analytics
      const getCourseSale = async function (course, index) {
        const orders = await order_courses.findAll({
          where: {
            status: "Paid",
            product_id: course.dataValues.course_id,
          },
        });
        let count = 0;
        orders.map(
          function (order, index) {
            if (order.dataValues.date_now.getMonth() === this.monI) {
              count++;
            }
          },
          { monI: this.monIndex }
        );

        return {
          course_name: course.dataValues.course_name,
          sale: count,
          color: `#${(0x1000000 + Math.random() * 0xffffff)
            .toString(16)
            .substr(1, 6)}`,
        };
      };

      let month = [
        {
          month: "january",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "february",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "march",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "april",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "may",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "june",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "july",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "august",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "september",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "october",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "november",
          course: [],
          sale_this_month: 0,
        },
        {
          month: "december",
          course: [],
          sale_this_month: 0,
        },
      ];

      for (let i = 0; i < month.length; i++) {
        //sets course array of each month
        month[i].course = await Promise.all(
          courses.map(getCourseSale, { monIndex: i })
        );
      }

      //function to iterate over months with callback exp
      const iterMonth = (value, exp) => {
        switch (value) {
          case 0:
            exp(0);
            break;
          case 1:
            exp(1);
            break;
          case 2:
            exp(2);
            break;
          case 3:
            exp(3);
            break;
          case 4:
            exp(4);
            break;
          case 5:
            exp(5);
            break;
          case 6:
            exp(6);
            break;
          case 7:
            exp(7);
            break;
          case 8:
            exp(8);
            break;
          case 9:
            exp(9);
            break;
          case 10:
            exp(10);
            break;
          case 11:
            exp(11);
            break;
          default:
            console.log("invalid");
        }
      };

      //sets overall sale of each month
      paidOrders.map((order, index) => {
        iterMonth(order.dataValues.updatedAt.getMonth(), (i) => {
          month[i].sale_this_month++;
        });
      });

      return res.json({
        status: "success",
        month,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }

  async add_chapter(req, res) {
    const { module_id, chapter_name, duration, description } = req.query;
    let { file } = req.files;

    if (!file.name) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      var infs = new ffmpeg();
      var chp_name = chapter_name.replace(" ", "_").trim();

      // console.log(chp_name)
      var fileName = Date.now() + "_" + chp_name;

      // console.log(fileName)
      var dir = fileName;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      await file.mv(
        path.dirname(__dirname) +
          `/${dir}/${fileName}` +
          path.extname(file.name)
      );

      const srcDir = "videoSourceFiles";

      // To copy a folder or file
      fse.copySync(srcDir, fileName, { overwrite: true }, function (err) {
        if (err) {
          console.error(err); // add if you want to replace existing folder or file with same name
        } else {
          console.log("success!");
        }
      });

      ffmpeg(fileName + "/" + fileName + path.extname(file.name))
        .addOptions([
          "-c:a aac",
          "-strict experimental",
          "-c:v libx264",
          "-s 320x180",
          "-f hls",
          "-hls_list_size 1000000000",
          "-hls_time 10",
        ])
        .on("start", () => console.log("starting first"))
        .output(fileName + "/180_out.m3u8")
        .on("progress", function (progress) {
          //console.log(progress);
          // var percent = round((progress.time/progress.duration) * 100);
          console.log("Processing: " + parseInt(progress.percent) + "% done");
        })
        .on("end", () => {
          console.log("first ended");
        })
        .run();

      ffmpeg(fileName + "/" + fileName + path.extname(file.name))
        .addOptions([
          "-c:a aac",
          "-strict experimental",
          "-c:v libx264",
          "-s 480x270",
          "-f hls",
          "-hls_list_size 1000000000",
          "-hls_time 10",
        ])
        .output(fileName + "/270_out.m3u8")
        .on("progress", function (progress) {
          //console.log(progress);
          // var percent = round((progress.time/progress.duration) * 100);
          console.log("Processing: " + parseInt(progress.percent) + "% done");
        })
        .on("end", () => {
          console.log("sec ended");
        })
        .run();

      ffmpeg(fileName + "/" + fileName + path.extname(file.name))
        .addOptions([
          "-c:a aac",
          "-strict experimental",
          "-c:v libx264",
          "-s 640x360",
          "-f hls",
          "-hls_list_size 1000000000",
          "-hls_time 10",
        ])
        .output(fileName + "/360_out.m3u8")
        .on("progress", function (progress) {
          //console.log(progress);
          // var percent = round((progress.time/progress.duration) * 100);
          console.log(
            "Processing: " + parseInt(parseInt(progress.percent)) + "% done"
          );
        })
        .on("end", () => {
          console.log("third ended");
        })
        .run();

      ffmpeg(fileName + "/" + fileName + path.extname(file.name), {
        timeout: 432000,
      })
        .addOptions([
          "-c:a aac",
          "-strict experimental",
          "-c:v libx264",
          "-s 960x540",
          "-f hls",
          "-hls_list_size 1000000000",
          "-hls_time 10",
        ])
        .output(fileName + "/540_out.m3u8")
        .on("progress", function (progress) {
          // //console.log(progress);
          // var percent = round((progress.time/progress.duration) * 100);
          console.log("Processing: " + parseInt(progress.percent) + "% done");
        })
        .on("end", () => {
          console.log("forth ended");
        })
        .run();

      ffmpeg(fileName + "/" + fileName + path.extname(file.name), {
        timeout: 432000,
      })
        .addOptions([
          "-c:a aac",
          "-strict experimental",
          "-c:v libx264",
          "-s 1280x720",
          "-f hls",
          "-hls_list_size 1000000000",
          "-hls_time 10",
        ])
        .output(fileName + "/720_out.m3u8")
        .on("progress", function (progress) {
          // //console.log(progress);
          // var percent = round((progress.time/progress.duration) * 100);
          console.log("Processing: " + parseInt(progress.percent) + "% done");
        })
        .on("end", async () => {
          console.log("fifth ended");
          var dir = `${fileName}/${fileName}` + path.extname(file.name);
          // console.log(dir);
          try {
            fs.unlinkSync(dir);
            console.log("Successfully deleted the file.");
          } catch (err) {
            console.log(err);
          }
          const uploadfinal = await upload();

          // directory path
          var dir2 = `${fileName}`;
          console.log(dir2);
          // delete directory recursively

          rimraf(dir2, () => {
            // fs.rmdir(path.dirname(__dirname)+`\\`+dir2,()=>{console.log(path.dirname(__dirname)+`\\`+dir2,'deleted')})
            console.log(dir2, "DELETED");
          });

          try {
            const AppearanceOrder = await Chapter.findAll({
              where: { module_id },
              raw: true,
              attributes: [
                [
                  sequelize.fn("max", sequelize.col("appearance_order")),
                  "appearance_order",
                ],
              ],
            });
            let latestAppearanceOrder = AppearanceOrder[0].appearance_order;
            // console.log(latestAppearanceOrder, AppearanceOrder);
            if (!latestAppearanceOrder) latestAppearanceOrder = 0;

            const module = await Module.findOne({
              where: { module_id },
            });

            if (!module) {
              return res.json({
                status: "failure",
                msg: "No module selected",
              });
            } else {
              const new_chapter = await Chapter.create({
                module_id,
                chapter_name,
                duration,
                video_src: `https://storage.googleapis.com/learningsystem/${fileName}/media_360.m3u8`,
                appearance_order: latestAppearanceOrder + 1,
                description,
              });
              return res.json({
                status: "success",
                new_chapter,
              });
            }
          } catch (err) {
            console.log(err);
            return res.json({
              status: "failure",
              msg: "System error",
              err,
            });
          }
        })
        .run();
      async function upload() {
        try {
          var folder = `./${fileName}/`;
          const url = [];
          const uploadfile = fs.readdir(fileName, async (err, files) => {
            try {
              files.forEach(async (file) => {
                // console.log(file);
                await bucket.upload(folder + String(file), {
                  destination: fileName + "/" + file,
                });
                // const publicUrl = `https://storage.googleapis.com/${config_Video.gcs_bucket}/${fileName}/${file}`;
                // url.push(publicUrl);
                // console.log(url);
              });
              return {
                status: "success",
                url: url,
              };
            } catch (err) {
              res.json({
                status: "failure",
                msg: "Server Error",
              });
            }
          });
          // console.log(uploadfile)
          return {
            // uploadfile,
            status: "success",
            url: `https://storage.googleapis.com/learningsystem/${fileName}/media_360.m3u8`,
          };
        } catch (err) {
          res.json({
            status: "failure",
            msg: err,
          });
        }
      }
    }
  }

  async daily_analytics(req, res) {
    try {
      const orders = await order_courses.findAll({
        where: {
          status: "Paid",
        },
      });
      const today = new Date();
      let data = {
        "00:00": 0,
        "02:00": 0,
        "04:00": 0,
        "06:00": 0,
        "08:00": 0,
        "10:00": 0,
        "12:00": 0,
        "14:00": 0,
        "16:00": 0,
        "18:00": 0,
        "20:00": 0,
        "22:00": 0,
      };
      const arr = orders.map((order, index) => {
        if (order.dataValues.date_now.getFullYear() === today.getFullYear()) {
          if (order.dataValues.date_now.getMonth() === today.getMonth()) {
            if (order.dataValues.date_now.getDate() === today.getDate()) {
              if (order.dataValues.date_now.getHours() <= 2) {
                data["02:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 4) {
                data["04:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 6) {
                data["06:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 8) {
                data["08:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 10) {
                data["10:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 12) {
                data["12:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 14) {
                data["14:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 16) {
                data["16:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 18) {
                data["18:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 20) {
                data["20:00"] += 1;
              } else if (order.dataValues.date_now.getHours() <= 22) {
                data["22:00"] += 1;
              } else if (
                order.dataValues.date_now.getHours() == 23 ||
                order.dataValues.date_now.getHours() == 0
              ) {
                data["00:00"] += 1;
              }
            }
          }
        }
      });

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failure",
        msg: "System error",
        err,
      });
    }
  }


 async weekly_analytics(req, res) {
  try {
    const paidOrders = await order_courses.findAll({
      where: {
        status: "Paid",
      },
    });
    const today = new Date();
    let week_days = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };

    const setWeekDay = (order_date) => {
      switch (order_date.getDay()) {
        case 0:
          week_days["sun"] += 1;
          break;
        case 1:
          week_days["mon"] += 1;
          break;
        case 2:
          week_days["tue"] += 1;
          break;
        case 3:
          week_days["wed"] += 1;
          break;
        case 4:
          week_days["thu"] += 1;
          break;
        case 5:
          week_days["fri"] += 1;
          break;
        case 6:
          week_days["sat"] += 1;
          break;
      }
    };
    let count = 0;

    paidOrders.map((order, index) => {
      if (order.dataValues.date_now.getFullYear() === today.getFullYear()) {
        if (order.dataValues.date_now.getMonth() === today.getMonth()) {
          if (today.getDate() >= 7) {
            if (
              order.dataValues.date_now.getDate() <= today.getDate() &&
              order.dataValues.date_now.getDate() >= today.getDate() - 7
            ) {
              console.log(
                "\n\n" + order.dataValues.name,
                order.dataValues.date_now.getDate()
              );
              setWeekDay(order.dataValues.date_now);
              count++;
            }
          } else {
            if (order.dataValues.date_now.getDate() <= today.getDate()) {
              count++;
              setWeekDay(order.dataValues.date_now);
            }
          }
        } else if (
          order.dataValues.date_now.getMonth() ===
          today.getMonth() - 1
        ) {
          if (
            (order.dataValues.date_now.getMonth() % 2 === 0 &&
              order.dataValues.date_now.getMonth() <= 6) ||
            (order.dataValues.date_now.getMonth() % 2 !== 0 &&
              order.dataValues.date_now.getMonth() > 6)
          ) {
            if (
              order.dataValues.date_now.getDate() >
              31 - 7 + today.getDate()
            ) {
              count++;
              setWeekDay(order.dataValues.date_now);
            }
          } else if (
            (order.dataValues.date_now.getMonth() % 2 !== 0 &&
              order.dataValues.date_now.getMonth() < 6) ||
            (order.dataValues.date_now.getMonth() % 2 === 0 &&
              order.dataValues.date_now.getMonth() > 6)
          ) {
            if (
              order.dataValues.date_now.getDate() >
              30 - 7 + today.getDate()
            ) {
              count++;
              setWeekDay(order.dataValues.date_now);
            }
          }
        }
      } else if (
        order.dataValues.date_now.getFullYear() ===
        today.getFullYear() - 1
      ) {
        if (
          order.dataValues.date_now.getMonth() === 11 &&
          today.getMonth() === 0
        ) {
          if (
            order.dataValues.date_now.getDate() >
            31 - 7 + today.getDate()
          ) {
            count++;
            setWeekDay(order.dataValues.date_now);
          }
        }
      }
    });

    return res.json({
      status: "success",
      total: count,
      week_days,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
 }

async custom_analytics(req, res) {
  const { initial_date, final_date } = req.body;
  const { course_id } = req.query;
  try {
    const getDatesBetweenDates = (start_date, end_date) => {
      let dates = []

      const theDate = new Date(start_date)
      while (theDate < end_date) {
        dates = [...dates, new Date(theDate)]
        theDate.setDate(theDate.getDate() + 1)
      }
      return dates
    }

    const getRevenue = (orders) => {
      let data = []
      dates.forEach((date) => {
        data.push([date.toLocaleDateString(), 0])
      })

      const arr = orders.map((order, index) => {
        dates.map((date, index) => {
          if (order.dataValues.date_now.getFullYear() === date.getFullYear()) {
            if (order.dataValues.date_now.getMonth() === date.getMonth()) {
              if (order.dataValues.date_now.getDate() === date.getDate()) {
                if (data[index][0] === date.toLocaleDateString()) {
                  data[index][1] += 1
                }
              }
            }
          }
        })
      });

      return res.json({
        status: "success",
        data
      });
    }
    const start_date = new Date(initial_date)
    const end_date = new Date(final_date)

    const dates = getDatesBetweenDates(start_date, end_date)


    let isValidDate = true;
    if (start_date.getTime() > end_date.getTime()) isValidDate = false;

    if (isValidDate) {


      if (course_id) {
        const ordersOne = await order_courses.findAll({
          where: {
            status: "Paid",
            product_id: course_id
          },
        });
        getRevenue(ordersOne)

      } else {
        const ordersAll = await order_courses.findAll({
          where: {
            status: "Paid",
          },
        });
        getRevenue(ordersAll)
      }


    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async all_admin_users(req, res) {
  try {
    const data = await admin_users.findAll({
      attributes: { exclude: ["createdAt"] },
      order: [["updatedAt", "DESC"]],
      raw: true
    })

    if (!data) {
      return res.json({
        status: "failure",
      });
    } else {
      return res.json({
        status: "success",
        data
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async update_admin_username(req, res) {
  const {
    old_username,
    new_username,
  } = req.body;
  try {
    const User = await admin_users.findOne({
      where: {
        username: old_username,
      },
    });
    const exist = await admin_users.findOne({
      where: { username: new_username }
    });

    const success = async () => {
      const otp_status = await otp.generateOTP(User.phonenumber)
      console.log(otp_status);
      return res.json({
        status: "success",
        msg: "OTP sent",
      });
    }
    if (!User) {
      return res.json({
        status: "failure",
        msg: "No User Found!",
      });
    } else {
      if (old_username != new_username) {
        if (exist) {
          return res.json({
            status: "failure",
            msg: "username already exist",
          });
        } else {
          await success()
        }
      } else {
        await success()
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async update_admin_user(req, res) {
  const {
    phonenumber,
    admin_users_id,
    username,
    password,
    otp
  } = req.body;
  try {
    const User = await admin_users.findOne({
      where: {
        admin_users_id,
      },
    });
    if (!User) {
      return res.json({
        status: "failure",
        msg: "No User Found!",
      });
    }
    else {
      if (User.otp == otp) {
        User.phonenumber = phonenumber;
        User.password = password;
        User.username = username;
        await User.save();
        return res.json({
          status: "success",
          msg: "User Updated!",
          // data,
        });
      } else {
        return res.json({
          status: "failure",
          msg: "Incorrect OTP!",
          // data,
        });
      }
    }
  } catch (err) {
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async delete_admin_user(req, res) {
  const { admin_users_id } = req.body
  try {
    const user = await admin_users.findOne({
      where: { admin_users_id }
    })
    if (!user) {
      return res.json({
        status: "failure",
        msg: "User not found"
      })
    } else {
      await user.destroy();
      return res.json({
        status: "success",
        msg: "admin user deleted succesfully"
      })
    }
  } catch (err) {
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async get_carousel(req, res) {
  try {
    // const {course_id} = req.query;
    const data = await carousel.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [["appearance_order", "ASC"]],
      raw: true,
    });

    if (!data) {
      return res.json({
        status: "failure",
      });
    } else {
      return res.json({
        status: "success",
        data
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async update_carousel(req, res) {
  const { carousel_id } = req.body;
  try {
    const data = await carousel.update(req.body, {
      where: { carousel_id },
      returning: true,
      plain: true,
    });

    if (!data) {
      return res.json({
        status: "failure",
        msg: "Not a valid carousel",
      });
    } else {
      return res.json({
        status: "success",
        data: data[1],
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async delete_carousel(req, res) {
  const { carousel_id } = req.body;
  try {
    const data = await carousel.findOne({
      where: { carousel_id },
    });

    if (!data) {
      return res.json({
        status: "failure",
        msg: "Invalid carousel",
      });
    } else {
      await data.destroy();
      return res.json({
        status: "success",
        msg: `Deletion successful`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async all_course_card(req, res) {
  // const { course_id } = req.query;
  try {
    const Data = await Course.findAll({
      attributes: [
        "course_id",
        "course_name",
        "course_thumb_img",
        "course_img",
        "mock_test",
        "enrolled_students",
        "course_join_img",
        "course_duration",
        "course_sale_price",
        "course_base_price",
        "course_video_url",
        "course_state",
        "state_logo",
        "course_lec",
        "category_type",
      ],
    });
    if (!Data) {
      return res.json({
        status: "failure",
        msg: "No Course Found!",
      });
    } else {
      return res.json({
        status: "success",
        Data,
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

async admin_to_employee(req, res) {
  const { admin_users_id } = req.body
  try {
    const data = await admin_users.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { admin_users_id },
    })

    if (!data) {
      return res.json({
        status: "failure",
      });
    } else {
      if (data.type == 'employee') {
        return res.json({
          status: "failure",
          msg: "user type is not admin"
        });
      } else {
        data.type = 'employee';
        await data.save()
      }

      return res.json({
        status: "success",
        data
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async employee_to_admin(req, res) {
  const { admin_users_id } = req.body
  try {
    const data = await admin_users.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { admin_users_id },
    })

    if (!data) {
      return res.json({
        status: "failure",
      });
    } else {
      if (data.type == 'admin') {
        return res.json({
          status: "failure",
          msg: "user type is not employee"
        });
      } else {
        data.type = 'admin';
        await data.save()
      }

      return res.json({
        status: "success",
        data
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async get_faq_ques(req, res) {
  try {
    // const {course_id} = req.query;
    const data = await faq_question.findAll({
      attributes: { exclude: ['createdAt'] },
      order: [["updatedAt", "DESC"]],
      raw: true
    });

    if (!data) {
      return res.json({
        status: "failure",
      });
    } else {
      return res.json({
        status: "success",
        data
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async add_faq_ques(req, res) {
  const {
    question, answer
  } = req.body;
  try {

    const data = await faq_question.create({
      question,
      answer
    });
    return res.json({
      status: "success",
      data,
    });

  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async update_user(req, res) {
  const { user_id } = req.body;
  // console.log(userId);
  try {
    const User = await user.findOne({
      where: { user_id },
    });

    if (User) {
      const update = await user.update(req.body, {
        where: { user_id },
        plain: true,
        returning: true
      })
      return res.json({
        status: "success",
        data: update[1],
        // data,
      });
    } else {
      return res.json({
        status: "failure",
        msg: "no matching user found",
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

async delete_user(req, res) {
  const { user_id } = req.body;
  try {
    const data = await user.findOne({
      where: { user_id },
    });

    if (!data) {
      return res.json({
        status: "failure",
        msg: "Invalid",
      });
    } else {
      await data.destroy();
      return res.json({
        status: "success",
        msg: `Deletion successful`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

async all_quizes(req, res) {
  try {
    const allQuiz = await quiz.findAll();

    const data = await Promise.all(
      allQuiz.map(async (quiz, index) => {
        const courseQuiz = await course_quiz.findOne({
          where: { course_quiz_id: quiz.dataValues.course_quiz_id },
        });
        if (courseQuiz) {
          quiz.dataValues["course_id"] = courseQuiz.course_id;
        }
        return quiz.dataValues;
      })
    );

    if (!allQuiz) {
      return res.json({
        status: "failure",
        msg: "No quiz found",
      });
    } else {
      return res.json({
        status: "success",
        allQuiz,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failure",
      msg: "System error",
      err,
    });
  }
}

}

module.exports = new AdminController();
