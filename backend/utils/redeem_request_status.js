const { redeem_request } = require("../models");

exports.redeem_request_status = async (user_id) => {
  return redeem_request.findOne({
    where: {
      user_id,
      status: "Pending",
    },
  });
};
