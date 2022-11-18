const { sequelize, company } = require("../../../models");

exports.deleteCompany = async (req, res, next) => {
  try {
    const { User } = req;
    if (User.user_type === "user")
      throw new Error("You don't have any company to delete");
    const { company_id } = req.query;
    if (!company_id) throw new Error("Please provide company_id");
    else {
      const removeCompany = await company.destroy({
        where: {
          company_id,
        },
      });
      if (!removeCompany) throw new Error("Company not removed");
      else res.json({ success: true, message: "Company removed successfully" });
    }
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
