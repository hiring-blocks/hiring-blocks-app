const { sequelize, company } = require("../../../models");
exports.verifyCompany = async (req, res) => {
  try {
    const { User } = req;
    const { company_id, company_proof_type } = req.body;
    if (req.file) {
      const file = req.file;
      const checkCompany = await company.findOne({
        where: {
          company_id: company_id,
          user_id: User.user_id,
        },
      });
      if (!checkCompany) throw new Error("Company not found");
      checkCompany.company_proof_type = company_proof_type;
      checkCompany.company_proof = file.filename;
      await checkCompany.save();
      res.json({
        success: true,
        message: "Verification will be completed in next 24 Hours",
      });
    } else {
      const checkCompany = await company.findOne({
        where: {
          company_id: company_id,
          user_id: User.user_id,
        },
      });
      if (!checkCompany) throw new Error("Company not found");
      checkCompany.company_proof_type = company_proof_type;
      checkCompany.company_proof = req.body.link;
      await checkCompany.save();
      res.json({
        success: true,
        message: "Verification will be completed in next 24 Hours",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
