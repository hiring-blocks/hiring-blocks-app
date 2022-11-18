const { sequelize, company } = require("../../../models");

exports.getAllCompanies = async (req, res, next) => {
  try {
    const query = `SELECT * FROM companies`;
    const [allcompanies] = await sequelize.query(query);
    const total_count=allcompanies.length;
    return res.json({
        success: true,
        message: "Companies retrieved successfully",
        allcompanies,
        total_count
      });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
