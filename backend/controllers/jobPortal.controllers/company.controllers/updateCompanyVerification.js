const { sequelize, company } = require("../../../models");

exports.companyVerification = async (req, res, next) => {
  try {
    const { company_id, status } = req.query;
    const checkCompany = await company.findOne({
      where: {
        company_id,
      },
    });
    if (!checkCompany) throw new Error("company not exist");
    checkCompany.verify_status = status;
    await checkCompany.save();
    res.json({ success: true, message: "company verified successfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
