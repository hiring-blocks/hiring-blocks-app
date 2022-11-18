const { sequelize, posted_jobs } = require("../../../models");

exports.searchJobs = async (req, res, next) => {
  try {
    const {search} = req.query;
    const query = `
    select job.*,company.* from posted_jobs job
    INNER JOIN companies company ON job.company_id = company.company_id
    where job_title ilike '%${search}%'  
    ORDER BY job.created_at ASC ;
    `;
    const [jobs] = await sequelize.query(query);
    return res.json({
      success: true,
      message: "Successfully got search results of jobs",
      totaljobs: jobs.length,
      jobs,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.searchCompany = async (req, res, next) => {
  try {
    const {search} = req.query;
    const query = `
    select job.*,company.* from posted_jobs job
    INNER JOIN companies company ON job.company_id = company.company_id
    where company.company_name ilike '%${search}%'  
    ORDER BY job.created_at ASC ;
    `;
    const [jobs] = await sequelize.query(query);
    return res.json({
      success: true,
      message: "Successfully got search results of jobs",
      totaljobs: jobs.length,
      jobs,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};


