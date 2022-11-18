const { user } = require("../models");

exports.checkIfReferralExists = async (code) => {
  try {
    const result = await user.findOne({
      where: {
        referral_code: code,
      },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return res.send("there was an error");
  }
};
