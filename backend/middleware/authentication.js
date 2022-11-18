const { user } = require("../models");
const jwt = require("jsonwebtoken");
exports.Auth = async (req, res, next) => {
  try {
    const auth = req.headers["auth"];
    if (!auth) res.json({ sucess: false, message: "Unauthorized access" });
    const token = auth.split(" ")[1];
    const compareToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!compareToken)
      res.json({ sucess: false, message: "Unauthorized access" });
    const User = await user.findOne({
      where: { token },
      raw: true,
    });
    if (!User) throw new Error("Unauthorized access");
    req.User = User;
    next();
  } catch (err) {
    res.json({ sucess: false, message: err.message });
  }
};
