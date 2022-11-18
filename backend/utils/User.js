const { user } = require("../models");

exports.checkIfUserverified = async (email) => {
  return user.findOne({
    where: {
      email,
      verified: "Yes",
    },
  });
};

exports.checkIfUserExists = async (email) => {
  return user.findOne({
    where: {
      email,
    },
  });
};
exports.checkIfUserExistsWithToken = async (token) => {
  return user.findOne({
    where: {
      token,
    },
  });
};

exports.DateForTo = () => {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return date;
};
