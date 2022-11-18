const { sequelize, user } = require("./../models");
const axios = require("axios");
function getOTP() {
  let otp = Math.random();
  otp = String(otp * 1000000);
  if (otp.length == 5) {
    otp = otp + "0";
    otp = parseInt(otp);
  } else if (otp.length == 4) {
    otp = otp + "00";
    otp = parseInt(otp);
  } else {
    otp = parseInt(otp);
  }
  return otp;
}
const sendOTP = async (otp, phonenumber) => {
  // const apistring = `http://api.msg91.com/api/v2/sendsms?authkey=${
  //   process.env.AUTH_KEY
  // }&mobiles=${phonenumber}&message=${
  //   "Dear User,Your otp is " + otp
  // }&sender=GVJBRO&route=4&country=91`;

  const apistring = `https://api.msg91.com/api/v5/otp?template_id=${process.env.TEMP_ID}&mobile=91${phonenumber}&authkey=${process.env.AUTH_KEY}&otp=${otp}`;
  const response = await axios.get(apistring);
  const User_otp_updated = await user.findOne({
    where: {
      mobile_no: phonenumber,
    },
  });
  User_otp_updated.otp = otp;
  await User_otp_updated.save();
  console.log("OTP sent. Otp is " + otp);
  console.log(response);
  console.log(response.data.type);
  return response.data.type;
};

const generateOTP = async (phonenumber) => {
  const otp = getOTP();
  // const otp = parseInt(123456);
  console.log(otp);
  const send_otp_status = await sendOTP(otp, phonenumber);
  return send_otp_status;
};

// module.exports = wazirx
module.exports = {
  generateOTP: generateOTP,
  sendOTP: sendOTP,
};
