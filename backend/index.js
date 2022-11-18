require("dotenv").config();
const { jobScheduler } = require("./middleware/cronJob");
const {
  sequelize,
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
  notification_tokens,
} = require("./models");
const Op = require("sequelize").Op;
const crypto = require("crypto");
const { DateForTo } = require("./utils/User");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const JobPortalRoutes = require("./routing/jobPortal.routing");
const ProfileRoutes = require("./routing/profile.routing");
const { Auth } = require("./middleware/authentication");
const cluster = require("cluster");
const os = require("os");
// const config = require("./config");
const app = express();
// const { promisify } = require("util");

const ccxt = require("ccxt"),
  HttpsProxyAgent = require("https-proxy-agent");
const proxy = process.env.http_proxy || "localhost:3000"; // HTTP/HTTPS proxy to connect to
const agent = new HttpsProxyAgent(proxy);
const axios = require("axios");
var cors = require("cors");
var http = require("http").createServer(app);
const socket = require("socket.io");
let swagger_doc = yaml.load("./swagger/api_doc.yml");
let swagger_doc_admin = yaml.load("./swagger/api_admin.yml");

const io = socket(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));

// Job Portal api's
app.use("/api", JobPortalRoutes);
app.use("/api/v1/", ProfileRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger_doc));
app.use("/api-admin", swaggerUi.serve, swaggerUi.setup(swagger_doc_admin));
const otp = require("./utils/otp.js");
const { get_course_percentage } = require("./utils/get_course_percentage");
const jwt = require("jsonwebtoken");
const { checkIotp } = require("./utils/checkOTP");
const { createSendToken } = require("./utils/JWTtoken");
const { createSendToken_foreign } = require("./utils/JWTtoken_Foreign");
const {
  checkIfUserExists,
  checkIfUserExistsWithToken,
  checkIfUserverified,
} = require("./utils/User");
const { checkIfReferralExists } = require("./utils/referral");
const { checkIfOrderpurchased } = require("./utils/order");
const { redeem_request_status } = require("./utils/redeem_request_status");
const routing = require("./routing/admin.routing");
const cookie_parser = require("cookie-parser");
const { sendMail } = require("./utils/mail");
const certificateRouting = require("./routing/certicate.routing");
// routing
app.use("/api/admin/", routing);
app.use("/api/v1", certificateRouting);
//certificate

const validateMetaLogin = async (user, signature) => {
  const ethUtil = require("ethereumjs-util");
  const { recoverPersonalSignature } = require("eth-sig-util");
  const msg = `${user.nonce}`;
  // Convert msg to hex string
  // const msgHex = ethUtil.bufferToHex(Buffer.from(msg));
  // const msgBuffer = ethUtil.toBuffer(msgHex);
  // const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
  // const signatureBuffer = ethUtil.toBuffer(signature);
  // const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
  // const publicKey = ethUtil.ecrecover(
  //   msgHash,
  //   signatureParams.v,
  //   signatureParams.r,
  //   signatureParams.s
  // );
  // const addresBuffer = ethUtil.publicToAddress(publicKey);
  // const address = ethUtil.bufferToHex(addresBuffer);
  const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });
  let token;
  console.log(user.wallet_address, address);
  if (address.toLowerCase() === user.wallet_address.toLowerCase()) {
    token = jwt.sign(
      {
        _id: user.user_id,
        address: user.nonce,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return token;
  } else {
    return false;
  }
};

app.get("/api/v1/metalogin", async (req, res) => {
  const { wallet_address, nonce, signature } = req.query;
  let verifyUser;
  try {
    if (!wallet_address) throw new Error("Please pass a wallet_address");
    verifyUser = await user.findOne({
      where: {
        wallet_address: wallet_address,
      },
      raw: true,
    });

    if (!verifyUser) {
      const createUser = await user.create({
        wallet_address,
        verified: false,
        signature: signature,
        nonce,
      });
      if (!createUser) throw new Error("User not Created");
      res.json({
        verified: false,
        nonce,
      });
    } else {
      if (verifyUser.verified === "true") {
        const token = await validateMetaLogin(verifyUser, verifyUser.signature);
        if (token) {
          await user.update(
            { token },
            {
              where: { user_id: verifyUser.user_id },
            }
          );
          res.json({
            success: true,
            verified: true,
            user_type: verifyUser.user_type,
            token,
            message: "Login Successfully",
          });
        } else {
          res.json({ success: false, message: "Invalid Signature" });
        }
      } else
        res.json({
          verified: false,
          nonce: verifyUser.nonce,
        });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
app.post("/api/v1/certificate", async (req, res) => {
  try {
    var { user_id, course_id } = req.body;
    if (user_id && course_id) {
      let data = await user_course_percentage.findOne({
        where: { user_id, course_id },
        raw: true,
        attributes: ["percentage_watched", "course_id", "user_id"],
      });
      let user_data = await user.findOne({ where: { user_id }, raw: true });
      let order_id = await order_courses.findOne({
        where: {
          product_id: course_id,
          email: user_data.email,
        },
        raw: true,
      });

      let courses = await Course.findOne({
        where: { course_id },
        raw: true,
        attributes: ["course_name"],
      });
      data.order_id = order_id.order_courses_id;
      data.user_name = user_data.full_name;
      data.course_name = courses.course_name;
      if (
        data.percentage_watched == "100.00" ||
        data.percentage_watched == "100"
      ) {
        res.json({
          status: "success",
          data,
        });
      } else
        return res.send({
          status: "fail",
          Error: "Please complete your course",
          course: courses,
        });
    } else return res.send({ Error: "Please provide credentials" });
  } catch (err) {
    console.log(err);
    let course = await Course.findOne({
      where: { course_id },
      attributes: ["course_name"],
    });

    res.send({ status: "fail", Error: "Not started yet", course });
  }
});
// popup
app.get("/api/v1/users_popup", async (req, res) => {
  try {
    let data = await user.findAll({
      where: {
        [Op.or]: [
          { user_type: "popup" },
          { user_type: "normal" },
          { user_type: "notification" },
          { user_type: "user-typenull" },
        ],
      },
      order: [["createdAt"]],
      raw: true,
    });
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i].time = String(data[i].createdAt).slice(4, 15);
        if (data[i].full_name === null) {
          data[i].full_name = "null";
        }
      }
      await res.json({
        status: "success",
        data,
      });
    } else {
      res.json({
        status: "fail",
        Error: "No data found",
      });
    }
  } catch (err) {
    console.log(err);
    await res.json({
      status: "Fail",
      Error: err,
    });
  }
});

app.put("/api/v1/editUser", Auth, async (req, res) => {
  try {
    const { User } = req;
    if (User.user_type === "company") throw new Error("You must be a user");

    const set_case = [];
    if (req.body.full_name)
      set_case.push(`full_name = '${req.body.full_name}'`);

    const query = `
      UPDATE users 
      SET  ${set_case.length ? set_case.join(",") : ""}
      WHERE user_id = '${User.user_id}'
      RETURNING *;
      `;
    const [usersData] = await sequelize.query(query);

    if (!usersData.length) throw new Error("Data not updated");
    else res.json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
});
app.post("/api/v1/register", async (req, res) => {
  try {
    const {
      full_name,
      email,
      countryCode,
      user_type,
      device,
      ip_address,
      time,
    } = req.query;
    if (email && full_name && ip_address) {
      let code = null;
      let present = "something";
      let i = 0;
      while (present) {
        code = crypto.randomBytes(3).toString("hex");

        present = await checkIfReferralExists(code);
      }
      const verified = "No";
      const exists = await user.findOne({ where: { email } });
      if (!exists) {
        const User = await user.create({
          full_name,
          email,
          countryCode,
          user_type,
          device,
          ip_address,
          time,
          verified,
          referral_code: code,
          commission: 0.25,
        });
        await sendMail(email);

        await user_history.create({
          full_name,
          email: email,
          device,
          ip_address,
          time,
          type: "register",
        });
        return res.json({ status: "success", info: "otp sends successfully" });
      } else {
        const checkverified = await user.findOne({
          where: {
            email,
            verified: "Yes",
          },
        });
        if (!checkverified) {
          const User = await user.findOne({
            where: {
              email,
            },
          });
          (User.full_name = full_name),
            (User.device = device),
            (User.ip_address = ip_address),
            (User.user_type = user_type),
            (User.time = time);

          await User.save();
          await user_history.create({
            full_name,
            email: email,
            device,
            ip_address,
            time,
            type: "register",
          });
          // return res.json("yes updated")
          const send_otp_status = await sendMail(email, full_name);
          // console.log(send_otp_status)
          return res.json({
            status: "success",
            info: "otp sends successfully",
          });
        } else {
          res.send({ status: "failure", msg: "email already exist" });
        }
      }
    } else
      return res.send({ status: "failure", msg: "Please sends credentials" });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.post("/api/v2/register", async (req, res) => {
  try {
    const {
      full_name,
      title,
      email,
      device,
      ip_address,
      time,
      other_info,
      mobile_no,
      skills,
      description,
      preference1,
      preference2,
      wallet_address,
    } = req.body;
    if (!wallet_address) throw new Error("Please provide wallet_address");
    let code = null;
    let present = "something";
    let i = 0;
    while (present) {
      code = crypto.randomBytes(3).toString("hex");
      present = await checkIfReferralExists(code);
    }
    const verified = true;
    const exists = await user.findOne({
      where: {
        verified: "true",
        wallet_address,
      },
    });

    if (!exists) {
      const User = await user.findOne({ where: { wallet_address } });
      if (!User) throw new Error("User not found");
      User.full_name = full_name;
      User.email = email;
      User.user_type = "user";
      User.device = device;
      User.ip_address = ip_address;
      User.time = time;
      User.other_info = other_info;
      User.mobile_no = mobile_no;
      User.skills = skills;
      User.description = description;
      User.preference1 = preference1;
      User.preference2 = preference2;
      User.title = title;
      User.verified = verified;
      User.referral_code = code;
      User.commission = 0.25;
      const token = await validateMetaLogin(User, User.signature);
      if (token) {
        User.token = token;
        await User.save();
        // const send_otp_status = await otp.generateOTP(email);
        // console.log(send_otp_status);
        await user_history.create({
          full_name,
          email,
          device,
          ip_address,
          time,
          type: "register",
        });
        return res.json({
          success: true,
          token,
          message: "User Registered Successfully",
        });
      } else res.json({ success: false, message: "Invalid signature" });
    } else {
      res.json({ success: true, message: "User Already Exists" });
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

// submit number
app.post("/api/v1/submit_number", async (req, res) => {
  try {
    const { email, user_type, device, ip_address, time } = req.query;
    const exists = await checkIfUserExists(email);
    if (exists) {
      return res.json({
        status: "failure",
        msg: "Number already exists",
      });
    }
    let code = null;
    let present = "something";
    let i = 0;
    while (present) {
      // if (i < 3) {
      //   code = "839dd4";
      //   i++;
      // } else {
      code = crypto.randomBytes(3).toString("hex");
      // }
      present = await checkIfReferralExists(code);
    }
    const result = await user.create({
      email,
      user_type,
      device,
      ip_address,
      time,
      commission: 0.25,
      referral_code: code,
      verified: "No",
    });
    return res.json({
      status: "success",
      msg: "Number submitted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      msg: "Server Error",
    });
  }
});

// pop up submit number
// submit number
app.post("/api/v1/popup_submit_number", async (req, res) => {
  try {
    const { full_name, email, user_type, device, ip_address, time } = req.query;
    const exists = await checkIfUserExists(email);
    if (exists) {
      return res.json({
        status: "failure",
        msg: "Number already exists",
      });
    }
    let code = null;
    let present = "something";
    let i = 0;
    while (present) {
      // if (i < 3) {
      //   code = "839dd4";
      //   i++;
      // } else {
      code = crypto.randomBytes(3).toString("hex");
      // }
      present = await checkIfReferralExists(code);
    }
    const result = await user.create({
      full_name,
      email,
      user_type,
      device,
      ip_address,
      commission: 0.25,
      referral_code: code,
      verified: "No",
    });

    let date = String(result.createdAt).slice(4, 15);
    result.time = date;
    await result.save();
    console.log(date);
    return res.json({
      status: "success",
      msg: "Number submitted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      msg: "Server Error",
    });
  }
});

// resend
app.post("/api/v1/resend", async (req, res) => {
  try {
    const { email } = req.query;
    const send_otp_status = await otp.generateOTP(email);
    return res.json({ status: send_otp_status });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

app.post("/api/v1/resend_mail", async (req, res) => {
  try {
    const { email } = req.query;
    if (email) {
      let User = await user.findOne({ where: { email: email } });
      if (User) {
        const send_otp_status = await sendMail(email, User.full_name);
        return res.json({ status: "success" });
      } else return res.json({ status: "failure", error: "No user found" });
    } else return res.json({ status: "failure", error: "Provide credentials" });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

// login
// app.post("/api/v1/login", async (req, res) => {
//   const { email, device, ip_address, time } = req.query;
//   const exists = await checkIfUserExists(email);
//   if (!exists) {
//     res.send({ status: "failure", msg: "Number is not registered" });
//   } else {
//     const checkverified = await checkIfUserverified(email);
//     if (!checkverified) {
//       res.send({ status: "failure", msg: "Number is not registered" });
//     } else {
//       const User = await user.findOne({
//         where: {
//           email,
//         },
//       });
//       (User.device = device),
//         (User.ip_address = ip_address),
//         (User.time = time);

//       await User.save();
//       // return res.json("yes updated")
//       const send_otp_status = await otp.generateOTP(email);
//       await user_history.create({
//         full_name: User.full_name,
//         email,
//         device,
//         ip_address,
//         time,
//         type: "login",
//       });
//       // console.log(send_otp_status)
//       return res.json({ send_otp_status, status: send_otp_status });
//     }
//   }
// });

app.post("/api/v1/login", async (req, res) => {
  const { email, device, ip_address, time } = req.query;
  if (email && ip_address) {
    const exists = await user.findOne({ where: { email } });
    if (!exists) {
      res.send({ status: "failure", msg: "user not registered" });
    } else {
      const checkverified = await user.findOne({ where: { email } });
      if (!checkverified) {
        res.send({ status: "failure", msg: "user not registered" });
      } else {
        const User = await user.findOne({
          where: {
            email,
          },
        });
        (User.device = device),
          (User.ip_address = ip_address),
          (User.time = time);

        await User.save();
        // return res.json("yes updated")
        console.log(exists.full_name);
        await sendMail(email, exists.full_name);
        return res.json({ status: "success", info: "otp sends successfully" });
      }
    }
  } else return res.send({ status: "failure", msg: "Please sends credentals" });
});

// verify

app.post("/api/v1/verify", async (req, res) => {
  const { mobile_no, otp } = req.query;
  const exists = await checkIotp(mobile_no, otp);
  if (!exists) {
    res.send({ status: "failure", msg: "Otp is incorrect" });
  } else {
    if (mobile_no == "8726956200" || mobile_no == "7206246045") {
      if (exists.token) {
        exists.verified = "Yes";
        await exists.save();
        let token = exists.token;
        res.json({
          status: "success",
          token,
        });
      } else {
        createSendToken(exists, 200, res);
      }
    } else {
      createSendToken(exists, 200, res);
    }

    // res.send(exists);
  }
});

app.post("/api/v1/verify_mail", async (req, res) => {
  const { email, otp } = req.query;
  const exists = await user.findOne({ where: { email: email, otp: otp } });
  if (!exists) {
    res.send({ status: "failure", msg: "Otp is incorrect" });
  }
  createSendToken(exists, 200, res);
});
// logout
app.post("/api/v1/logout", async (req, res) => {
  try {
    res.cookie("token", "logged", {
      expires: new Date(Date.now() - 1 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "failure",
    });
  }
});

// user info decoded token
app.get("/api/v1/userinfo", async (req, res) => {
  // let token = null;
  const { token } = req.query;
  const User = await user.findOne({
    attributes: [
      "full_name",
      "email",
      "mobile_no",
      "user_type",
      "countryCode",
      "user_id",
      "users_total_clicks",
      "resume",
      "profile_picture",
      "cover_picture",
      "education",
      "experience",
      "skills",
      "description",
      "title",
      "other_info",
      "certificates",
      "preference1",
      "preference2",
      "addnote",
    ],
    where: {
      token,
    },
  });
  if (!User) {
    res.json({ status: "failure" });
  } else {
    if (User.education == null) User.education = [];
    if (User.experience == null) User.experience = [];
    if (User.experience.length) {
      User.experience = User.experience.map((item) => {
        if (item.to.length == 0) {
          item.to = DateForTo();
          return item;
        }
        return item;
      });
      User.experience = User.experience.sort((a, b) => {
        return new Date(b.to) - new Date(a.to);
      });
    }
    if (User.education.length) {
      User.education = User.education.map((item) => {
        if (item.to.length == 0) {
          item.to = DateForTo();
          return item;
        }
        return item;
      });
      User.experience = User.experience.sort((a, b) => {
        if (!a.to.length) DateForTo();
        if (!b.to.length) DateForTo();
        return new Date(b.to) - new Date(a.to);
      });
    }
    const currentUser = User.toJSON();
    currentUser.uuid = currentUser.referral_id;
    return res.json({ User: currentUser, status: "success" });
  }
});

// Notification Token
app.post("/api/v1/notification_token", async (req, res) => {
  try {
    const { user_id, notification_token } = req.query;
    const User = await user.findOne({
      where: {
        user_id,
      },
    });
    if (User) {
      User.notification_token = notification_token;
      console.log(User);
      await User.save();
      return res.json({
        status: "success",
        message: "Notification Token updated",
      });
    } else {
      return res.json({
        status: "failure",
        message: "No user Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "Cannot connect to database",
    });
  }
});

// Only Notification Token
app.post("/api/v1/notification_token_only", async (req, res) => {
  try {
    const { notification_token } = req.query;
    const User = await notification_tokens.create({
      notification_token,
    });
    if (User) {
      return res.json({
        status: "success",
        message: "Notification Token updated",
      });
    } else {
      return res.json({
        status: "failure",
        message: "No user Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "Cannot connect to database",
    });
  }
});

//get all course
app.get("/api/v1/all_courses", async (req, res) => {
  const allCategory = await Category.findAll({
    attributes: ["category_id", "category_type", "category_name"],
  });
  const allCourses = await Category.findAll({
    attributes: [],
    order: [
      // [  'updatedAt', 'desc'  ],
      [{ model: Course }, "appearance_order", "DESC"],
    ],
    include: [
      {
        model: Course,
        attributes: [
          "course_id",
          "course_name",
          "what_u_get",
          "course_thumb_img",
          "checkout_desc",
          "course_ratings",
          "course_duration",
          "course_video_url",
          "enrolled_students",
          "course_sale_price",
          "course_base_price",
          "course_state",
          "mock_test",
          "course_video_url",
          "course_lec",
          "state_logo",
          "appearance_order",
          "page_title",
          "meta_desc",
          "checkout_page_title",
          "checkout_meta_desc",
        ],
        //  'updated_at', 'asc
        //   order: [
        //     // ['id', 'DESC'],
        //     ['appearance_order', 'ASC'],
        // ],
        // order: [[{Course},'appearance_order', 'ASC']]
      },
    ],
  });
  if (allCourses) {
    return res.json({
      status: "success",
      category: allCategory,
      data: allCourses,
    });
  }
  res.json({
    status: "failure",
    message: "no data found",
  });
});

//courses from 1 Category
app.get("/api/v1/category_all_courses", async (req, res) => {
  const { category_type } = req.query;
  const allCategory = await Category.findAll({
    attributes: ["category_id", "category_type", "category_name"],
  });
  try {
    const data = await Category.findOne({
      // attributes: ["category_id", "category_type", "category_name"],
      attributes: [],
      order: [[{ model: Course }, "appearance_order", "ASC"]],
      include: [
        {
          model: Course,
          attributes: [
            "course_id",
            "course_name",
            "course_thumb_img",
            "what_u_get",
            "checkout_desc",
            "course_ratings",
            "course_duration",
            "enrolled_students",
            "course_sale_price",
            "course_base_price",
            "course_state",
            "category_type",
            "course_video_url",
            "mock_test",
            "course_lec",
            "course_video_url",
            "state_logo",
            "page_title",
            "meta_desc",
            "checkout_page_title",
            "checkout_meta_desc",
          ],
        },
      ],
      where: {
        category_type,
      },
    });
    return res.json({
      status: "success",
      category: allCategory,
      data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

//single course with FAQ, modules,chapters,teachers,Why_join
app.get("/api/v1/single_course", async (req, res) => {
  try {
    const { course_id } = req.query;
    let courseData = await Course.findOne({
      where: {
        course_id,
      },
      order: [
        ["appearance_order", "ASC"],
        [{ model: Topic, as: "topics" }, "appearance_order", "ASC"],
        [
          { model: Topic, as: "topics" },
          { model: Module, as: "sub_topics" },
          "appearance_order",
          "ASC",
        ],
        // [{ model: Teacher, as: "teachers" }, "appearance_order", "ASC"],
        // [
        //   { model: Topic, as: "topics" },
        //   { model: Module, as: "sub_topics" },
        //   { model: Chapter, as: "chapters" },
        //   "appearance_order",
        //   "ASC",
        // ],
        // [
        //   { model: course_quiz, as: "course_quizes" },
        //   { model: quiz, as: "quizes" },
        //   "appearance_order",
        //   "ASC",
        // ],
        // [{ model: Faq, as: "faqs" }, "appearance_order", "ASC"],
        [{ model: Why_join, as: "why_joins" }, "appearance_order", "ASC"],
      ],
      attributes: [
        "course_id",
        "course_name",
        "course_desc",
        "course_thumb_img",
        "what_u_get",
        "checkout_desc",
        "course_img",
        "course_join_img",
        "course_ratings",
        "course_duration",
        "enrolled_students",
        "course_sale_price",
        "course_base_price",
        "course_video_url",
        "course_state",
        "category_type",
        "course_code",
        "mock_test",
        "course_lec",
        "state_logo",
        "page_title",
        "meta_desc",
        "checkout_page_title",
        "checkout_meta_desc",
        "what_u_get_with_course_heading",
        "what_u_get_with_course_1",
        "what_u_get_with_course_2",
        "what_u_get_with_course_3",
        "what_u_get_with_course_4",
        "what_u_get_join_heading",
        "exam_prep_heading",
        "syllabus_section_heading",
        "what_u_get_heading",
        "checkout_unlocking_point1",
        "checkout_unlocking_point2",
        "checkout_unlocking_point3",
        "checkout_unlocking_point4",
        "checkout_endline",
      ],
      include: [
        {
          model: Topic,
          as: "topics",
          attributes: [
            "topic_id",
            "appearance_order",
            "topic_name",
            "total_videos",
            "duration",
            "demo_src",
          ],
          // order: [],
          include: [
            {
              model: Module,
              as: "sub_topics",
              attributes: ["module_id", "module_name", "appearance_order"],
              // order: [],
              // include: [
              //   {
              //     model: Chapter,
              //     as: "chapters",
              //     attributes: [
              //       "chapter_id",
              //       "chapter_name",
              //       "appearance_order",
              //     ],
              //     // order: [],
              //   },
              // ],
            },
          ],
        },
        // {
        //   model: course_quiz,
        //   as: "course_quizes",
        //   attributes: { exclude: ["createdAt", "updatedAt"] },
        //   order: [[{ model: quiz }, "appearance_order", "ASC"]],
        //   include: [
        //     {
        //       model: quiz,
        //       as: "quizes",
        //       attributes: { exclude: ["createdAt", "updatedAt"] },
        //     },
        //   ],
        // },
        // {
        //   model: Teacher,
        //   as: "teachers",
        //   attributes: ["teacher_id", "prof_name", "prof_desc", "prof_img"],
        //   through: { attributes: [] },
        // },
        {
          model: Why_join,
          as: "why_joins",
          attributes: ["why_join_id", "question", "answer", "appearance_order"],
        },
      ],
    });
    if (courseData) {
      let qry = "SELECT * FROM faqs";
      let [faq] = await sequelize.query(qry);
      return res.json({
        status: "success",
        data: courseData,
        faq,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no course found",
    });
  }
});

// single course_chapters
app.get("/api/v1/chapters_course", async (req, res) => {
  try {
    const { subtopic_id } = req.query;
    let courseData = await Module.findOne({
      where: {
        module_id: subtopic_id,
      },
      order: [
        // ["appearance_order", "ASC"],
        [{ model: Chapter, as: "chapters" }, "appearance_order", "ASC"],
      ],
      attributes: [
        "module_id",
        "module_name",
        // "demo_src"
      ],
      include: [
        {
          model: Chapter,
          as: "chapters",
          attributes: [
            "chapter_id",
            "chapter_name",
            "duration",
            "description",
            "appearance_order",
          ],
          // order: [],
        },
      ],
    });
    if (courseData) {
      return res.json({
        status: "success",
        data: courseData,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no course found",
    });
  }
});

//   check out

// const checkIfOrderExists = async (whereObject) => {
//     return order_courses.findOne({
//       where: whereObject,
//     });
//   };

app.post("/api/v1/order_courses", async (req, res) => {
  // console.log(req.query.name);
  // console.log(req.query.address);
  const requestData = {
    email: req.query.email,
    name: req.query.name,
    address: req.query.address,
    city: req.query.city,
    state: req.query.state,
    pincode: req.query.pincode,
    referral_id: req.query.referral_id,
    from_ip: req.query.from_ip,
    from_browser: req.query.from_browser,
    amount: req.query.amount,
    product_id: req.query.product_id,
    payment_type: req.query.payment_type,
    status: "Paid",
    capture_status: "No",
  };
  try {
    //check if already exists
    const exists = await checkIfOrderpurchased({
      email: requestData.email,
      product_id: requestData.product_id,
      status: "Paid",
    });
    if (exists) {
      return res.json({
        status: "failure",
        message: "Already Purchased",
        // data: { order_uuid: orderData.uuid },
      });
    }
    const result = await order_courses.create(requestData);
    return res.json({
      status: "success",
      message: "order initiated, Payment Pending",
      order_id: result.order_courses_id,
    });
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});

// app.post("/api/v1/update_order_courses", async (req, res) => {
//   const { order_id, product_id, email, payment_id, capture_status } = req.query;
//   try {
//     //check if order exists
//     const user = await order_courses.findOne({
//       where: {
//         order_courses_id: order_id,
//         product_id: product_id,
//         email: email,
//       },
//     });
//     if (user) {
//       user.capture_status = capture_status;
//       console.log(user);
//       user.status = "Paid";
//       user.payment_id = payment_id;
//       await user.save();
//       return res.json({
//         status: "success",
//         message: "Payment successful",
//       });
//     } else {
//       // user.capture_status = capture_status
//       console.log(user);
//       // user.status = "Paid";
//       // user.payment_id = payment_id;
//       // await user.save()
//       return res.json({
//         status: "failure",
//         message: "Payment unsuccessful",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.send("there was an error check console");
//   }
// });

app.get("/api/v1/check_order", async (req, res) => {
  try {
    const { product_id, email } = req.query;
    const exists = await checkIfOrderpurchased({
      email,
      product_id,
      status: "Paid",
    });
    if (exists) {
      // const orderData = exists.toJSON();
      return res.json({
        status: "success",
        message: "Already Purchased",
        // data: { order_uuid: orderData.uuid },
      });
    }
    res.json({
      status: "Failure",
      message: "not purchased",
    });
  } catch (error) {
    console.log(error);
    res.send("there was an error check console");
  }
});

//pno userid courseid noofclucks uniquevisitor

//users total clucks, total unique visitor, commisions

//1
//2 show data
app.post("/api/v1/user_referral", async (req, res) => {
  const { course_id, user_referral_code, revisiting } = req.query;
  // console.log(user_referral_code)
  try {
    const currentUser = await user.findOne({
      where: {
        referral_code: user_referral_code,
      },
    });
    if (!currentUser) {
      return res.json({
        status: "failure",
        msg: "Wrong referral Code",
      });
    }
    const exist = await users_affilate_analytics.findOne({
      where: {
        user_referral_code,
        course_id,
      },
    });
    currentUser.users_total_clicks = Number(currentUser.users_total_clicks) + 1;
    if (exist) {
      if (revisiting == "true" || revisiting == "True") {
        currentUser.save();
        exist.number_of_clicks = Number(exist.number_of_clicks) + 1;
        exist.save();
        return res.json({
          status: "success",
        });
      } else {
        currentUser.total_unique_visitors =
          Number(currentUser.total_unique_visitors) + 1;
        currentUser.save();
        exist.number_of_clicks = Number(exist.number_of_clicks) + 1;
        exist.unique_visitors = Number(exist.unique_visitors) + 1;
        exist.save();
        return res.json({
          status: "success",
        });
      }
    } else {
      currentUser.total_unique_visitors =
        Number(currentUser.total_unique_visitors) + 1;
      currentUser.save();
      const result = await users_affilate_analytics.create({
        user_id: currentUser.user_id,
        user_referral_code,
        course_id,
        number_of_clicks: 1,
        unique_visitors: 1,
        email: currentUser.email,
      });
      return res.json({
        status: "success",
      });
    }
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});
// affiliate_courses
app.get("/api/v1/affiliate_courses", async (req, res) => {
  const { user_referral_code } = req.query;
  console.log(user_referral_code);
  try {
    const courseData = await Course.findAll({
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
        "state_logo",
      ],
      raw: true,
    });
    const users_affilated = await users_affilate_analytics.findAll({
      where: {
        user_referral_code: user_referral_code,
      },
      attributes: [
        "user_referral_code",
        "course_id",
        "number_of_clicks",
        "unique_visitors",
      ],
      raw: true,
    });
    const orderData = await order_courses.findAll({
      where: {
        referral_id: user_referral_code,
        status: "Paid",
      },
      attributes: ["amount", ["product_id", "course_id"]],
      raw: true,
    });

    console.log(users_affilated);

    courseData.forEach((single_course) => {
      for (i in users_affilated) {
        if (single_course.course_id === users_affilated[i].course_id) {
          single_course.number_of_clicks = users_affilated[i].number_of_clicks;
          single_course.unique_visitors = users_affilated[i].unique_visitors;
          single_course.referral_code = user_referral_code;
        }
      }
      if (!single_course.unique_visitors) {
        single_course.number_of_clicks = "0";
        single_course.unique_visitors = "0";
        single_course.referral_code = user_referral_code;
      }
    });
    //get user to get commision
    const currentUser = await user.findOne({
      where: {
        referral_code: user_referral_code,
      },
      attributes: ["commission"],
      raw: true,
    });
    if (!currentUser) {
      return res.json({
        status: "failure",
        message: "no user found with this referral code",
      });
    }
    for (i in courseData) {
      courseData[i].bonus_earned = 0;
      courseData[i].referral_earned = 0;

      for (j in orderData) {
        if (courseData[i].course_id === orderData[j].course_id) {
          courseData[i].bonus_earned += Number(orderData[j].amount);
          courseData[i].referral_earned++;
        }
      }
      courseData[i].bonus_earned *= currentUser ? currentUser.commission : 0.25;
      if (courseData[i].referral_earned > 0) {
        courseData[i].max_referral_amount =
          courseData[i].bonus_earned / courseData[i].referral_earned;
      } else {
        courseData[i].max_referral_amount =
          courseData[i].course_sale_price *
          (currentUser ? currentUser.commission : 0.25);
      }
    }
    res.json({
      status: "success",
      data: courseData,
    });
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});
// get uuid
// display all purchased courses
app.get("/api/v1/purchased_courses", async (req, res) => {
  try {
    const { email } = req.query;
    const currentUser = await checkIfUserExists(email);
    if (!currentUser) {
      return res.json({
        status: "failure",
        msg: "email does not exist",
      });
    }
    const orderData = await order_courses.findAll({
      where: {
        email: email,
        status: "Paid",
      },
      attributes: [
        ["product_id", "course_id"],
        "order_courses_id",
        "name",
        "email",
        "address",
        "city",
        "state",
        "pincode",
        ["amount", "course_price"],
        "date_now",
      ],
      raw: true,
    });
    console.log(orderData);
    const courseData = await Course.findAll({
      where: {
        // [Op.or]: orderData,
        [Op.or]: { course_id: orderData.map((item) => item.course_id) },
      },
      order: [["appearance_order", "ASC"]],
      attributes: [
        "course_id",
        "course_name",
        "course_thumb_img",
        "course_ratings",
        "total_video",
        "course_duration",
        "enrolled_students",
        "course_sale_price",
        "course_base_price",
        "category_type",
        "course_lec",
        "total_video",
        "mock_test",
        "examination_date",
        "live_session_date",
        "state_logo",
        "appearance_order",
      ],
      raw: true,
    });

    const last_lecture = await lecture_record.findAll({
      where: {
        [Op.and]: [
          { user_id: currentUser.user_id },
          { [Op.or]: { course_id: orderData.map((item) => item.course_id) } },
        ],
      },
      attributes: ["last_chapter_id", "course_id", "chapter_name"],
      raw: true,
    });
    const total_mock_completed = await user_quiz_scores.findAll({
      where: {
        [Op.and]: [
          { user_id: currentUser.user_id },
          { [Op.or]: { course_id: orderData.map((item) => item.course_id) } },
        ],
      },
      raw: true,
    });
    console.log({ last_lecture, total_mock_completed });
    const coursePercentages = await user_course_percentage.findAll({
      where: {
        user_id: currentUser.user_id,
      },
      attributes: ["course_id", "percentage_watched"],
      raw: true,
    });
    courseData.forEach((single_course) => {
      single_course.percentage_watched = "0.00";
      coursePercentages.forEach((single_course_percentage) => {
        if (single_course.course_id === single_course_percentage.course_id) {
          single_course.percentage_watched =
            single_course_percentage.percentage_watched;
        }
      });
      single_course.last_lecture_watched = "Not Started";
      last_lecture.forEach((single_last_lecture) => {
        if (single_last_lecture.course_id === single_course.course_id) {
          single_course.last_lecture_watched = single_last_lecture.chapter_name;
        }
      });
      single_course.total_mock_completed = 0;
      total_mock_completed.forEach((single_mock_test) => {
        if (single_mock_test.course_id === single_course.course_id) {
          single_course.total_mock_completed += 1;
        }
      });

      orderData.forEach((orderData_id) => {
        if (orderData_id.course_id === single_course.course_id) {
          single_course.order_courses_id = orderData_id.order_courses_id;
          single_course.name = orderData_id.name;
          single_course.email = orderData_id.email;
          single_course.address = orderData_id.address;
          single_course.city = orderData_id.city;
          single_course.state = orderData_id.state;
          single_course.pincode = orderData_id.pincode;
          single_course.course_price = orderData_id.course_price;
          single_course.date_now = orderData_id.date_now;
        }
      });
    });
    res.json({ status: "success", data: courseData });
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});

// email uuid && course_id check if course bought
app.get("/api/v1/single_purchased_course", async (req, res) => {
  const { email, course_id } = req.query;
  try {
    const purchased = await order_courses.findOne({
      where: {
        email,
        product_id: course_id,
        status: "Paid",
      },
    });
    const currentUser = await user.findOne({
      where: {
        email: email,
      },
      raw: true,
    });
    const result = await user_chapter_history.findAll({
      where: {
        user_id: currentUser.user_id,
        course_id,
      },
      raw: true,
    });
    if (purchased) {
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
            attributes: [
              "topic_id",
              "topic_name",
              "duration",
              "topic_info",
              ["total_videos", "totalVideos"],
            ],
            include: [
              {
                model: Module,
                as: "sub_topics",
                attributes: [
                  "module_id",
                  "module_name",
                  "duration",
                  "description",
                ],
                include: [
                  {
                    model: Chapter,
                    as: "chapters",
                    attributes: [
                      "chapter_id",
                      "chapter_name",
                      "duration",
                      "description",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      let newData = courseData.toJSON();

      newData = await get_course_percentage(
        newData,
        result,
        currentUser.user_id
      );
      if (newData) {
        return res.json({
          status: "success",
          data: newData,
        });
      } else {
        res.json("course error");
      }
    } else {
      res.send({
        status: "failure",
        message: "The course is not purchased",
      });
    }
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});

//total_bonus
app.get("/api/v1/total_bonus", async (req, res) => {
  try {
    const { email, referral_id } = req.query;
    const data = await order_courses.findAll({
      where: {
        referral_id,
        status: "Paid",
      },
      attributes: ["amount"],
      raw: true,
    });
    const User = await user.findOne({
      where: {
        referral_code: referral_id,
      },
      attributes: ["commission"],
      raw: true,
    });
    const redeemed = await redeem_request.findAll({
      where: {
        email,
        status: "Paid",
      },
      attributes: ["redeem_amount"],
      raw: true,
    });
    const commission = User.commission;
    let total_bonus_earned = 0;
    let total_bonus_redeemed = 0; // calculate this
    for (i in data) {
      total_bonus_earned += parseInt(data[i].amount);
    }
    total_bonus_earned *= commission;
    for (i in redeemed) {
      total_bonus_redeemed += parseInt(redeemed[i].redeem_amount);
    }
    const total_bonus_redeemable = total_bonus_earned - total_bonus_redeemed;
    if (data) {
      return res.json({
        status: "success",
        total_bonus_earned,
        total_bonus_redeemable,
        total_bonus_redeemed,
      });
    } else {
      return res.json({
        status: "failure",
      });
    }
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});

// amount = course * comission, date, refered_user referral_id

//bonus_history
app.get("/api/v1/bonus_history", async (req, res) => {
  try {
    const { referral_id } = req.query;
    const currentUser = await user.findOne({
      where: {
        referral_code: referral_id,
      },
    });
    if (!currentUser) {
      return res.json({
        status: "failure",
      });
    }
    let data = await order_courses.findAll({
      where: {
        referral_id,
        status: "Paid",
      },
      attributes: [
        "product_id",
        "amount",
        ["name", "purchased_by"],
        "date_now",
        "referral_id",
        "status",
      ],
      raw: true,
    });

    let courses = await Course.findAll({
      where: {
        [Op.or]: { course_id: data.map((item) => item.product_id) },
      },
      raw: true,
      attributes: ["course_name", "course_id"],
    });
    console.log({ data, courses });
    let newData = [];
    for (j in courses) {
      for (i in data) {
        if (data[i].product_id === courses[j].course_id) {
          newData = [
            ...newData,
            {
              ...data[i],
              amount: data[i].amount * (currentUser.commission || 0.25),
              course_name: courses[j].course_name,
            },
          ];
        }
      }
    }
    if (courses) {
      return res.json({
        status: "success",
        purchaseData: newData,
      });
    }
    res.json({
      status: "failure",
    });
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});

//redeem_request
app.post("/api/v1/redeem_requests", async (req, res) => {
  try {
    const {
      user_id,
      email,
      gpay_number,
      phonepe_number,
      paytm_number,
      upi_number,
      upi_id,
      account_number,
      account_name,
      account_ifsc,
      method,
      redeem_amount,
      from_ip,
      from_browser,
      time,
    } = req.query;
    const redeemrequeststatus = await redeem_request_status(user_id);
    if (redeemrequeststatus) {
      return res.json({
        status: "failure",
        msg: "You already have a pending request placed. Please wait till the request is processed to place another.",
      });
    }
    //calculating the bonus the user has
    // 1) check if user exists and get his commission rate
    const currentUser = await user.findOne({
      where: {
        user_id,
      },
      attributes: ["user_id", "commission", "referral_code"],
      raw: true,
    });
    if (!currentUser) {
      return res.json({
        status: "failure",
        msg: "User not recognised",
      });
    }
    //2) get amount of  courses purchased using this users referral_code
    const purchased_courses_amount = await order_courses.findAll({
      where: {
        referral_id: currentUser.referral_code,
        status: "Paid",
      },
      attributes: ["amount"],
      raw: true,
    });
    //3) sum and multiply with commission
    let redeemable_amount = 0;
    purchased_courses_amount.forEach((course_amount) => {
      redeemable_amount += Number(course_amount.amount);
    });
    redeemable_amount *= Number(currentUser.commission);
    //4) calculate amount already redeemed by the user
    const redeemed = await redeem_request.findAll({
      where: {
        user_id,
        status: "Paid",
      },
      attributes: ["redeem_amount"],
      raw: true,
    });
    let amount_redeemed = 0;
    redeemed.forEach((single_request) => {
      amount_redeemed += Number(single_request.redeem_amount);
    });
    //5) subtract redeemed amount from redeemable amount
    redeemable_amount = redeemable_amount - amount_redeemed;
    if (redeemable_amount <= 0 || redeemable_amount < Number(redeem_amount)) {
      return res.json({
        status: "failure",
        msg: "You do not have any amount to redeem currently.",
      });
    }
    const resultRequest = await redeem_request.create({
      user_id,
      email,
      gpay_number,
      phonepe_number,
      paytm_number,
      upi_number,
      upi_id,
      account_number,
      account_name,
      account_ifsc,
      method,
      status: "Pending",
      redeem_amount,
      from_ip,
      from_browser,
      time,
    });
    // const resultMethod = await redeem_method.create({
    //   user_id,
    //   email,
    //   gpay_number,
    //   phonepe_number,
    //   paytm_number,
    //   account_number,
    //   account_name,
    //   account_ifsc,
    //   method,
    //   selected: method,
    //   from_ip,
    //   from_browser,
    //   time,
    // });
    // if (resultRequest && resultMethod) {
    //   return res.json({
    //     status: "success",
    //   });
    // }
    if (resultRequest) {
      return res.json({
        status: "success",
      });
    }
    res.json({
      status: "failure",
    });
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});

//amount method date status

//redeem history
app.get("/api/v1/redeem_history", async (req, res) => {
  try {
    const { user_id } = req.query;
    const data = await redeem_request.findAll({
      where: {
        user_id,
        // status: "Paid",
      },
      // attributes: { exclude: ["createdAt", "updatedAt"] },
      attributes: ["redeem_amount", "method", "status", "time"],
    });
    if (data) {
      return res.json({
        status: "success",
        data,
      });
    }
    res.json({
      status: "failure",
      message: "there are no redeemed requests",
    });
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});

app.get("/api/v1/single_purchase_course_video", async (req, res) => {
  try {
    const { course_id } = req.query;
    let courseData = await Course.findOne({
      where: {
        course_id,
      },
      order: [
        ["appearance_order", "ASC"],
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
        [
          { model: course_quiz, as: "course_quizes" },
          { model: quiz, as: "quizes" },
          "appearance_order",
          "ASC",
        ],
        [{ model: Faq, as: "faqs" }, "appearance_order", "ASC"],
        [{ model: Why_join, as: "why_joins" }, "appearance_order", "ASC"],
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
        "category_type",
        "course_code",
      ],
      include: [
        {
          model: Topic,
          as: "topics",
          attributes: ["topic_id", "topic_name", "duration", "total_videos"],
          include: [
            {
              model: Module,
              as: "sub_topics",
              attributes: [
                "module_id",
                "module_name",
                "duration",
                "description",
              ],
              include: [
                {
                  model: Chapter,
                  as: "chapters",
                  attributes: [
                    "chapter_id",
                    "chapter_name",
                    "duration",
                    "description",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: course_quiz,
          as: "course_quizes",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: quiz,
              as: "quizes",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: Faq,
          as: "faqs",
          attributes: ["faq_id", "question", "answer"],
        },
        {
          model: Teacher,
          as: "teachers",
          attributes: ["teacher_id", "prof_name", "prof_desc", "prof_img"],
          through: { attributes: [] },
        },
        {
          model: Why_join,
          as: "why_joins",
          attributes: ["why_join_id", "question", "answer"],
        },
      ],
    });
    if (courseData) {
      return res.json({
        status: "success",
        data: courseData,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no course found",
    });
  }
});

//quiz api quiz questions
app.get("/api/v1/quiz_questions", async (req, res) => {
  try {
    const { quiz_id, user_id, course_id } = req.query;
    const currentUser = await user.findOne({
      where: {
        user_id,
      },
      raw: true,
    });
    const purchased = await checkIfOrderpurchased({
      email: currentUser.email,
      product_id: course_id,
      status: "Paid",
    });
    if (purchased) {
      const quizData = await quiz.findOne({
        where: {
          quiz_id,
        },
        order: [
          ["appearance_order", "ASC"],
          [{ model: quiz_questions }, "appearance_order", "ASC"],
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: quiz_questions,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });
      if (quizData) {
        return res.json({
          status: "success",
          data: quizData,
        });
      } else {
        return res.json({
          status: "failure",
          message: "no quiz found",
        });
      }
    } else {
      return res.json({
        status: "failure",
        message: "course not purchased",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

// fetch_video_url
app.get("/api/v1/fetch_video_url", async (req, res) => {
  try {
    const { course_id, user_id, chapter_id } = req.query;
    const currentUser = await user.findOne({
      where: {
        user_id,
      },
      raw: true,
    });
    const purchased = await checkIfOrderpurchased({
      email: currentUser.email,
      product_id: course_id,
      status: "Paid",
    });
    if (purchased) {
      console.log("true");
      const data = await Chapter.findOne({
        where: {
          chapter_id,
        },
        attributes: [
          "video_src",
          "chapter_name",
          ["duration", "chapter_duration"],
        ],
        raw: true,
      });
      return res.json({
        status: "success",
        data,
      });
    } else {
      return res.json({
        status: "failure",
        msg: "course is not purchased",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

// chapter watched
app.post("/api/v1/chapter_watched", async (req, res) => {
  try {
    const { course_id, chapter_id, user_id, percentage } = req.query;
    const result = await user_chapter_history.findOne({
      where: {
        user_id,
        chapter_id,
      },
    });

    const courseData = await Course.findOne({
      where: {
        course_id,
      },
      include: [
        {
          model: Topic,
          as: "topics",
          attributes: ["topic_id", "topic_name", "duration"],
          include: [
            {
              model: Module,
              as: "sub_topics",
              attributes: ["module_id", "module_name"],
              include: [
                {
                  model: Chapter,
                  as: "chapters",
                  attributes: ["chapter_id", "chapter_name"],
                },
              ],
            },
          ],
        },
      ],
    });
    // console.log(courseData);
    const rawData = courseData.toJSON();

    if (result) {
      result.percentage_watched = percentage;
      await result.save();
    } else {
      await user_chapter_history.create({
        user_id,
        course_id,
        percentage_watched: percentage,
        chapter_id,
      });
    }
    const allChapterHistory = await user_chapter_history.findAll({
      where: {
        user_id,
        course_id,
      },
      raw: true,
    });
    await get_course_percentage(rawData, allChapterHistory, user_id);
    return res.json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

//lecture record api
app.get("/api/v1/get_lecture_record", async (req, res) => {
  try {
    const { user_id, course_id } = req.query;
    const data = await lecture_record.findOne({
      where: {
        user_id,
        course_id,
      },
    });
    if (data) {
      return res.json({
        status: "success",
        data,
      });
    }
    return res.json({
      status: "failure",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

// update lecture record
app.post("/api/v1/update_lecture_record", async (req, res) => {
  try {
    const { user_id, module_id, chapter_id, course_id } = req.query;
    var last_chapter_name;
    const chapter_name = await Chapter.findOne({
      where: {
        chapter_id: chapter_id,
      },
    });
    if (chapter_name) {
      last_chapter_name = chapter_name.chapter_name;
    } else {
      last_chapter_name = "Not Started";
    }
    const exists = await lecture_record.findOne({
      where: {
        course_id,
        user_id,
      },
    });
    if (exists) {
      exists.last_module_id = module_id;
      exists.last_chapter_id = chapter_id;
      exists.chapter_name = last_chapter_name;
      exists.save();
      console.log("lecture record updated");
    } else {
      await lecture_record.create({
        user_id,
        course_id,
        last_module_id: module_id,
        last_chapter_id: chapter_id,
        chapter_name: last_chapter_name,
      });
      console.log("new lecture record added");
    }
    return res.json({
      status: "success",
      msg: "last lecture record updated",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "failure",
    });
  }
});

// search course
app.get("/api/v1/all_courses_search", async (req, res) => {
  try {
    const { search } = req.query;
    // console.log(search)
    if (search == "") {
      res.json({
        status: "failure",
        msg: "no courses found",
      });
    } else {
      const seperatedQuery = search
        .split(" ")
        .filter((item) => {
          if (
            item.match("(^c+ourse)") ||
            item.match("(^C+ourse)") ||
            item.match("(^C+OURSE)")
          ) {
            return false;
          }
          return true;
        })
        .map((item) => `%${item}%`);
      // console.log(seperatedQuery)

      const results = await Course.findAll({
        where: {
          [Op.or]: {
            course_name: {
              [Op.iLike]: {
                [Op.any]: seperatedQuery,
              },
            },
            category_type: {
              [Op.iLike]: {
                [Op.any]: seperatedQuery,
              },
            },
          },
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      // console.log(results.length)
      if (results.length != 0) {
        return res.json({
          status: "success",
          data: results,
        });
      } else {
        res.json({
          status: "failure",
          msg: "no courses found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

// set quiz score
app.post("/api/v1/set_score", async (req, res) => {
  try {
    const { user_id, quiz_id, score, time, course_id } = req.query;
    const exists = await user_quiz_scores.findOne({
      where: {
        user_id,
        quiz_id,
      },
    });
    await user_quiz_scores_history.create({
      user_id,
      quiz_id,
      score,
      course_id,
      time,
    });
    if (exists) {
      exists.score = score;
      exists.time = exists.time;
      exists.save();
      return res.json({
        status: "success",
      });
    } else {
      await user_quiz_scores.create({
        user_id,
        quiz_id,
        score,
        course_id,
        time,
      });
      return res.json({
        status: "success",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: "failure",
    });
  }
});

// get quiz score
app.get("/api/v1/get_quiz_scores", async (req, res) => {
  try {
    const { user_id, course_id } = req.query;
    const currentUser = await user.findOne({
      where: {
        user_id,
      },
    });
    if (!currentUser) {
      res.json({
        status: "failure",
        message: "this user does not exist",
      });
    }
    //get course quizes
    const courseQuizes = await Course.findOne({
      where: {
        course_id,
      },
      attributes: [],
      order: [
        [
          { model: course_quiz, as: "course_quizes" },
          { model: quiz, as: "quizes" },
          "appearance_order",
          "ASC",
        ],
      ],
      include: [
        {
          model: course_quiz,
          as: "course_quizes",
          include: [
            {
              model: quiz,
              as: "quizes",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    //get user scores
    const userScores = await user_quiz_scores.findAll({
      where: {
        user_id,
      },
      attributes: [
        "user_quiz_scores_id",
        "quiz_id",
        "user_id",
        "score",
        "time",
      ],
      raw: true,
    });
    //course quiz null
    if (!courseQuizes) {
      return res.json({
        status: "failure",
        message: "there are no quizes or you provided with the wrong course id",
      });
    }
    const rawCourseQuizData = courseQuizes.toJSON();
    //merging both scores and quizes
    if (rawCourseQuizData.course_quizes.length < 1) {
      return res.json({
        status: "failure",
        message: "there are no quizes",
      });
    }
    rawCourseQuizData.course_quizes[0].quizes.forEach((single_quiz) => {
      single_quiz.score = "---";
      single_quiz.time = "---";
      userScores.forEach((single_quiz_score) => {
        if (single_quiz.quiz_id === single_quiz_score.quiz_id) {
          single_quiz.score = single_quiz_score.score;
          single_quiz.time = single_quiz_score.time;
        }
      });
    });
    res.json({
      status: "success",
      data: rawCourseQuizData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

// invoice

app.get("/api/v1/invoice", async (req, res) => {
  try {
    const { order_courses_id } = req.query;
    const results = await order_courses.findOne({
      where: {
        order_courses_id,
      },
      attributes: [
        "name",
        "email",
        "address",
        "city",
        "state",
        "pincode",
        ["product_id", "course_id"],
        ["amount", "course_price"],
        "date_now",
      ],
      raw: true,
    });
    if (!results) {
      return res.json({
        status: "failure",
        message: "no course found",
      });
    }
    const courseData = await Course.findOne({
      where: {
        course_id: results.course_id,
      },
      attributes: ["course_name"],
      raw: true,
    });
    results.course_name = courseData.course_name;
    return res.json({
      status: "success",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

app.get("/api/v1/apply_discount_coupon", async (req, res) => {
  const { course_id, coupon_name } = req.query;
  try {
    var coupon_name_upper_case = coupon_name.toUpperCase();
    let courseData = await Course.findOne({
      where: {
        course_id,
      },
      attributes: ["course_sale_price"],
      raw: true,
    });
    if (!courseData) {
      return res.json({
        status: "failure",
        message: "Invalid Course!",
      });
    }
    const results = await discount_coupon.findOne({
      where: {
        coupon_name: coupon_name_upper_case,
        course_id,
      },
      attributes: ["coupon_name", "course_id", "flat"],
      raw: true,
    });
    if (!results) {
      return res.json({
        status: "failure",
        message: "Invalid Coupon!",
      });
    }
    var amount = Number(courseData.course_sale_price) - Number(results.flat);
    return res.json({
      status: "Success",
      message: amount,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "Some technical error",
    });
  }
});

// enter data
app.get("/api/v1/enter_courses", async (req, res) => {
  try {
    const {
      course_name,
      course_desc,
      course_duration,
      course_ratings,
      enrolled_students,
      course_lec,
      course_thumb_img,
      course_img,
      course_video_url,
      course_join_img,
      course_sale_price,
      course_base_price,
      course_state,
      category_type,
      course_code,
      status,
      appearance_order,
      what_u_get,
      checkout_desc,
      state_logo,
      mock_test,
      examination_date,
      live_session_date,
      page_title,
      meta_desc,
      checkout_page_title,
      checkout_meta_desc,
      what_u_get_with_course_heading,
      what_u_get_with_course_1,
      what_u_get_with_course_2,
      what_u_get_with_course_3,
      what_u_get_with_course_4,
      what_u_get_join_heading,
      exam_prep_heading,
      syllabus_section_heading,
      what_u_get_heading,
      checkout_unlocking_point1,
      checkout_unlocking_point2,
      checkout_unlocking_point3,
      checkout_unlocking_point4,
      checkout_endline,
      telegram_grp,
    } = req.body;
    const user = await Course.create({
      course_name,
      course_desc,
      course_duration,
      course_ratings,
      enrolled_students,
      course_lec,
      course_thumb_img,
      course_img,
      course_video_url,
      course_join_img,
      course_sale_price,
      course_base_price,
      course_state,
      category_type,
      course_code,
      status,
      appearance_order,
      what_u_get,
      checkout_desc,
      state_logo,
      mock_test,
      examination_date,
      live_session_date,
      page_title,
      meta_desc,
      checkout_page_title,
      checkout_meta_desc,
      what_u_get_with_course_heading,
      what_u_get_with_course_1,
      what_u_get_with_course_2,
      what_u_get_with_course_3,
      what_u_get_with_course_4,
      what_u_get_join_heading,
      exam_prep_heading,
      syllabus_section_heading,
      what_u_get_heading,
      checkout_unlocking_point1,
      checkout_unlocking_point2,
      checkout_unlocking_point3,
      checkout_unlocking_point4,
      checkout_endline,
      telegram_grp,
    });
    return res.json({
      status: "success",
      // data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

app.get("/api/v1/topic", async (req, res) => {
  const {
    topic_name,
    course_id,
    duration,
    appearance_order,
    total_videos,
    demo_src,
  } = req.body;
  try {
    const user = await Topic.create({
      topic_name,
      course_id,
      duration,
      appearance_order,
      total_videos,
      demo_src,
    });
    return res.json({
      status: "success",
      // data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

app.get("/api/v1/enter_discount_coupon", async (req, res) => {
  const { course_id, coupon_name, flat } = req.body;
  try {
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
        message: "Invalid Course!",
      });
    }
    var coupon_name_upper_case = coupon_name.toUpperCase();
    const results = await discount_coupon.findOne({
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
    const user = await discount_coupon.create({
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
});

app.get("/api/v1/update_discount_coupon", async (req, res) => {
  const { course_id, coupon_name, flat } = req.body;
  try {
    var coupon_name_upper_case = coupon_name.toUpperCase();
    const results = await discount_coupon.findOne({
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
});

app.get("/api/v1/delete_discount_coupon", async (req, res) => {
  const { course_id, coupon_name } = req.body;
  try {
    var coupon_name_upper_case = coupon_name.toUpperCase();
    const results = await discount_coupon.findOne({
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
});

app.get("/api/v1/fetch_discount_coupon", async (req, res) => {
  const { course_id } = req.body;
  try {
    // var coupon_name_upper_case = coupon_name.toUpperCase();
    let courseData = await Course.findOne({
      where: {
        course_id,
      },
      attributes: ["course_sale_price"],
      raw: true,
    });
    if (!courseData) {
      return res.json({
        status: "failure",
        message: "Invalid Course!",
      });
    }
    const results = await discount_coupon.findAll({
      where: {
        course_id,
      },
      attributes: ["coupon_name", "course_id", "flat"],
      raw: true,
    });
    if (!results) {
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
});

app.get("/api/v1/Module", async (req, res) => {
  const { module_name, topic_id, duration, appearance_order, description } =
    req.body;
  try {
    const user = await Module.create({
      module_name,
      topic_id,
      duration,
      appearance_order,
      description,
    });
    return res.json({
      status: "success",
      // data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

app.get("/api/v1/Chapter", async (req, res) => {
  const {
    chapter_name,
    module_id,
    video_src,
    duration,
    appearance_order,
    description,
  } = req.body;
  try {
    const user = await Chapter.create({
      // module_id: "2bb31dbb-f331-40cf-ba5c-8969f198a7fd",
      // chapter_name: "chapter 1",
      // video_src: "some video src",
      chapter_name,
      module_id,
      video_src,
      duration,
      appearance_order,
      description,
    });
    return res.json({
      status: "success",
      // data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

// enter course quiz
app.get("/api/v1/course_quiz", async (req, res) => {
  const { course_id, heading, total_quizes, duration } = req.body;

  try {
    const user = await course_quiz.create({
      // module_id: "2bb31dbb-f331-40cf-ba5c-8969f198a7fd",
      // chapter_name: "chapter 1",
      // video_src: "some video src",
      course_id,
      heading,
      total_quizes,
      duration,
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
      message: "no data found",
    });
  }
});

// update course quiz
app.get("/api/v1/update_course_quiz", async (req, res) => {
  const { course_quiz_id, course_id, heading, total_quizes, duration } =
    req.body;

  try {
    const User = await course_quiz.findOne({
      where: {
        course_quiz_id,
      },
    });
    if (User) {
      (User.course_id = course_id),
        (User.heading = heading),
        (User.total_quizes = total_quizes),
        (User.duration = duration);

      await User.save();
      return res.json({
        status: "success",
        User,
        // data,
      });
    }
    return res.json({
      status: "failure",
      msg: "no course quiz found!",
      // data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

// delete course quiz
app.get("/api/v1/delete_course_quiz", async (req, res) => {
  const { course_quiz_id } = req.body;

  try {
    const User = await course_quiz.findOne({
      where: {
        course_quiz_id,
      },
    });
    if (User) {
      await User.destroy();
      return res.json({
        status: "success",
        // data,
      });
    }
    return res.json({
      status: "failure",
      msg: "no course quiz found!",
      // data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

// get data of course quiz
app.get("/api/v1/get_data_course_quiz", async (req, res) => {
  const { course_id } = req.body;
  try {
    const results = await course_quiz.findAll({
      where: {
        course_id,
      },
    });
    if (results) {
      return res.json({
        status: "success",
        results,
        // data,
      });
    } else {
      return res.json({
        status: "failure",
        msg: "No quiz found!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

// enter quiz
app.get("/api/v1/quiz", async (req, res) => {
  const {
    course_quiz_id,
    quiz_name,
    total_questions,
    total_marks,
    total_time,
    appearance_order,
  } = req.body;
  try {
    const user = await quiz.create({
      // module_id: "2bb31dbb-f331-40cf-ba5c-8969f198a7fd",
      // chapter_name: "chapter 1",
      // video_src: "some video src",
      course_quiz_id,
      quiz_name,
      total_questions,
      total_marks,
      total_time,
      appearance_order,
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
      message: "no data found",
    });
  }
});

// Update quiz
app.get("/api/v1/update_quiz", async (req, res) => {
  const {
    quiz_id,
    course_quiz_id,
    quiz_name,
    total_questions,
    total_marks,
    total_time,
    appearance_order,
  } = req.body;
  try {
    const User = await quiz.findOne({
      where: {
        quiz_id,
      },
    });
    if (User) {
      (User.course_quiz_id = course_quiz_id),
        (User.quiz_name = quiz_name),
        (User.total_questions = total_questions),
        (User.total_marks = total_marks),
        (User.total_time = total_time),
        (User.appearance_order = appearance_order);

      await User.save();
      return res.json({
        status: "success",
        User,
        // data,
      });
    }
    return res.json({
      status: "failure",
      msg: "no course quiz found!",
      // data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

// delete quiz
app.get("/api/v1/delete_quiz", async (req, res) => {
  const { quiz_id } = req.body;
  try {
    const User = await quiz.findOne({
      where: {
        quiz_id,
      },
    });
    if (User) {
      await User.destroy();
      return res.json({
        status: "success",
        // data,
      });
    }
    return res.json({
      status: "failure",
      msg: "no quiz found!",
      // data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

// enter quiz questions
app.get("/api/v1/quiz_question", async (req, res) => {
  const {
    quiz_id,
    question,
    question_img,
    option1,
    option1_img,
    option2,
    option2_img,
    option3,
    option3_img,
    option4,
    option4_img,
    answer,
    appearance_order,
  } = req.body;
  try {
    const user = await quiz_questions.create({
      // module_id: "2bb31dbb-f331-40cf-ba5c-8969f198a7fd",
      // chapter_name: "chapter 1",
      // video_src: "some video src",
      quiz_id,
      question,
      question_img,
      option1,
      option1_img,
      option2,
      option2_img,
      option3,
      option3_img,
      option4,
      option4_img,
      answer,
      appearance_order,
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
      message: "no data found",
    });
  }
});

// delete quiz questions
app.get("/api/v1/delete_quiz_question", async (req, res) => {
  const { quiz_question_id } = req.body;
  try {
    const User = await quiz_questions.findOne({
      where: {
        quiz_question_id,
      },
    });
    if (User) {
      await User.destroy();
      return res.json({
        status: "success",
        msg: "Deleted!",
        // data,
      });
    }
    return res.json({
      status: "failure",
      msg: "no quiz found!",
      // data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
      message: "no data found",
    });
  }
});

app.get("/api/v1/enter_faq", async (req, res) => {
  const user = await Faq.create({
    question: "So who can benefit from learning graphic design?",
    answer:
      "The fundamentals of design are useful for a lot of careers, industries, and hobbies. It doesn't matter if it's logo design, web design, social media, user interface design, advertising, product design, printing, or t-shirts. This course will cover ideas that can be used in any niche!",
    course_id: "2f104ebd-f597-4315-9c33-6dbe571cdd7b",
  });
});

app.get("/api/v1/why_join", async (req, res) => {
  const user = await Why_join.create({
    question: "Unlimited Course & Students",
    answer:
      "find what you are interested to learn onlin and choose exactly what is best for you",
    course_id: "2f104ebd-f597-4315-9c33-6dbe571cdd7b",
  });
});
app.get("/api/v1/category", async (req, res) => {
  const user = await Category.create({
    category_name: "Himachal Pradesh",
    category_type: "himachal",
  });
});

app.get("/api/v1/Teacher", async (req, res) => {
  const user = await Teacher.create(
    {
      prof_desc: "I ma teacher 1",
      prof_img: "some image link",
      prof_name: "demetri caron",
    },
    {
      prof_desc: "I ma teacher 2",
      prof_img: "some image link",
      prof_name: "demetri caron",
    }
  );
});
app.get("/api/v1/Chapter", async (req, res) => {
  const user = await Chapter.create({
    module_id: "2bb31dbb-f331-40cf-ba5c-8969f198a7fd",
    chapter_name: "chapter 1",
    video_src: "some video src",
  });
});
app.get("/api/v1/Course_teacher", async (req, res) => {
  const user = await course_teacher.create({
    course_id: "a3696e6c-79df-4e50-aaea-42e953eba7f3",
    teacher_id: "a3696e6c-79df-4e50-aaea-42e953eba7f3",
  });
});

// app.get("/api/v1/course_quiz", async (req, res) => {
//   const user = await course_quiz.create({
//     course_id: "2f104ebd-f597-4315-9c33-6dbe571cdd7b",
//     heading: "Practice Quiz",
//     total_quizes: "2",
//     duration: "40 min",
//   });
// });

// app.get("/api/v1/quiz", async (req, res) => {
//   const user = await quiz.create({
//     course_quiz_id: "2f104ebd-f597-4315-9c33-6dbe571cdd7b",
//     quiz_name: "Mock 1",
//     total_questions: "4",
//     total_marks: "4",
//     total_time: "4",
//   });
// });

app.get("/api/v1/check_quiz_question", async (req, res) => {
  try {
    const { quiz_id } = req.query;
    const quizData = await quiz.findOne({
      where: {
        quiz_id,
      },
      order: [
        ["appearance_order", "ASC"],
        [{ model: quiz_questions }, "appearance_order", "ASC"],
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: quiz_questions,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    if (quizData) {
      return res.json({
        status: "success",
        data: quizData,
      });
    } else {
      return res.json({
        status: "failure",
        message: "no quiz found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

app.post("/api/v1/sepe_topic", async (req, res) => {
  const {
    topic_name,
    course_id,
    duration,
    appearance_order,
    total_videos,
    demo_src,
  } = req.body;
  try {
    const user = await Topic.create({
      topic_name,
      course_id,
      duration,
      appearance_order,
      total_videos,
      demo_src,
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
      message: "no data found",
    });
  }
});

app.post("/api/v1/sepe_Module", async (req, res) => {
  const { module_name, topic_id, duration, appearance_order, description } =
    req.body;
  try {
    const user = await Module.create({
      module_name,
      topic_id,
      duration,
      appearance_order,
      description,
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
      message: "no data found",
    });
  }
});

app.post("/api/v1/sepe_Chapter", async (req, res) => {
  const {
    chapter_name,
    module_id,
    video_src,
    duration,
    appearance_order,
    description,
  } = req.body;
  try {
    const user = await Chapter.create({
      // module_id: "2bb31dbb-f331-40cf-ba5c-8969f198a7fd",
      // chapter_name: "chapter 1",
      // video_src: "some video src",
      chapter_name,
      module_id,
      video_src,
      duration,
      appearance_order,
      description,
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
      message: "no data found",
    });
  }
});

app.get("/api/v1/check_topics", async (req, res) => {
  try {
    const { topic_id } = req.query;
    const topicData = await Topic.findOne({
      where: {
        topic_id,
      },
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
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Module,
          as: "sub_topics",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: Chapter,
              as: "chapters",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
    if (topicData) {
      return res.json({
        status: "success",
        data: topicData,
      });
    } else {
      return res.json({
        status: "failure",
        message: "no topic found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "failure",
    });
  }
});

// server for messaging

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

// if (cluster.isMaster) {
//   for (let i = 0; i < os.cpus().length; i++) {
//     cluster.fork();
//   }
//   cluster.on("end", () => {
//     cluster.fork();
//   });
// } else
http.listen(process.env.PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("database connected");
    jobScheduler();
    console.log(`server running on port ${process.env.PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    // console.log(`server running on port ${process.env.PORT}`);
  }
});
