const { sequelize, company } = require("../../../models");

exports.getCompany = async (req, res, next) => {
  try {
    const { User } = req;
    if (User.user_type === "user") throw new Error("Not found");
    const userCompany = await company.findAll({
      where: {
        user_id: User.user_id,
      },
      raw: true,
    });
    if (!userCompany.length) throw new Error("Not found");
    else
      res.json({
        success: true,
        message: "Company get successfully",
        company: userCompany,
      });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
