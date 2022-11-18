const jwt = require("jsonwebtoken");
const { user } = require("../models");

const signToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createSendToken_foreign = async (client, statusCode, res) => {
  const token = signToken(client.email);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // if (process.env.NODE_ENV === "production")
  cookieOptions.secure = true;

  res.cookie("token", token, cookieOptions);
  const User = await user.findOne({
    where: {
      email: client.email,
    },
  });
  (User.token = token), (User.verified = "Yes");
  console.log("yes");

  await User.save();
  res.status(statusCode).json({
    status: "success",
    token,
  });
};
