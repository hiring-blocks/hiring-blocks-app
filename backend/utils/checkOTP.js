const { user } = require("../models");

exports.checkIotp = async (mobile_no, otp) => {
  return user.findOne({
    where: {
      mobile_no,
      otp,
    },
  });
};
