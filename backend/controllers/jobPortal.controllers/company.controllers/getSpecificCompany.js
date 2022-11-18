const { sequelize, company } = require("../../../models");

exports.getSpecificCompanies = async (req, res, next) => {
  try {
    const {company_id} = req.query;
    const query=`Select job.*,company.* from posted_jobs job
    INNER JOIN companies company ON job.company_id = company.company_id
    WHERE company.company_id='${company_id}'
    ORDER BY job.created_at ASC`;
    const [specificCompany] = await sequelize.query(query);
    if (!specificCompany.length) throw new Error("Not found");
    else
      res.json({
        success: true,
        message: "Company get successfully",
        specificCompany
      });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
