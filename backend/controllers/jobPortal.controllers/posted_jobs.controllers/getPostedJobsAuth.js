const { sequelize, posted_jobs,applied_jobs } = require("../../../models");

exports.getPostedJobAuth = async (req, res, next) => {
  try {
    const { User} = req;
    const LIMIT = 10;
    let page = req.query.page || 0;
    const jobQuery = `
      SELECT job_id FROM applied_jobs WHERE user_id = '${User.user_id}';
      `;
    const [jobIds] = await sequelize.query(jobQuery);
    const query = `
    select job.*,company.* from posted_jobs job
    INNER JOIN companies company ON job.company_id = company.company_id
    WHERE job_id!='${jobIds.length}'
    ORDER BY job.created_at DESC
    LIMIT ${LIMIT} offset ${LIMIT * page};
        `;
    const [jobs] = await sequelize.query(query);
    return res.json({
      success: true,
      message: "Successfully got list of jobs",
      jobs,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};


