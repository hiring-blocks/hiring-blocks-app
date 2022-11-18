const nodemailer = require("nodemailer");
const { user } = require("../models");
const templateOtp = require("./template");

exports.sendMail = async (email, name) => {
  try {
    let otp = (Math.random() * 1000000) >> 0;
    if (otp) {
      let transporter = nodemailer.createTransport({
        // service: "gmail",
        // auth: {
        //   type: "OAuth2",
        //   user: process.env.MAIL_USERNAME,
        //   pass: process.env.MAIL_PASSWORD,
        //   clientId: process.env.OAUTH_CLIENTID,
        //   clientSecret: process.env.OAUTH_CLIENT_SECRET,
        //   refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        // },
        host: "smtp.zoho.in",
        port: 465,
        secure: true,

        auth: {
          user: "vaibhav@quadbgroup.com",
          pass: "TGTsPDfns3G8",
        },
      });
      var mailOptions = {
        from: "vaibhav@quadbgroup.com",
        to: email,
        subject: "One Time Password From Learning app",
        html: templateOtp(otp, name),
      };
      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          console.log(error);
        } else {
          const User_otp_updated = await user.findOne({
            where: {
              email,
            },
          });
          User_otp_updated.otp = otp;
          await User_otp_updated.save();
          console.log("OTP sent. Otp is " + otp);
        }
      });
    } else console.log("otp not created");
  } catch (err) {
    console.log(err);
  }
};

// module.exports = sendMail;
