const { sequelize, posted_jobs, user, company } = require("../../../models");

exports.getJobs = async (req, res) => {
  try {
    const job_query = `SELECT COUNT(*) FROM posted_jobs;`;
    const [totalJobs] = await sequelize.query(job_query);
    if (!totalJobs.length) throw new Error("No jobs yet!!");
    res.json({
      success: true,
      totalJobs: totalJobs[0],
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const user_query = `SELECT COUNT(*) FROM users;`;
    const [totalUsers] = await sequelize.query(user_query);
    if (!totalUsers.length) throw new Error("No users yet!!");
    res.json({
      success: true,
      totalUsers: totalUsers[0],
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const company_query = `SELECT COUNT(*) FROM companies;`;
    const [totalCompanies] = await sequelize.query(company_query);
    if (!totalCompanies.length) throw new Error("No companies yet!!");
    res.json({
      success: true,
      totalCompanies: totalCompanies[0],
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getFilledJobs = async (req, res, next) => {
  try {
    const filledJobs_query = ` SELECT COUNT(*) FROM applied_jobs 
          INNER JOIN posted_jobs ON applied_jobs.job_id = posted_jobs.job_id`;
    const [totalFilledJobs] = await sequelize.query(filledJobs_query);
    if (!totalFilledJobs.length) throw new Error("Not found");
    res.json({
      success: true,
      message: "Get applied jobs successfully",
      totalFilledJobs: totalFilledJobs[0],
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.recentApplicantsCompanies = async (req, res, next) => {
  try {
    const { User } = req;
    const { company_id } = req.query;
    if (User.user_type === "user") throw new Error("you must be a company");
    const applicants_query = `SELECT (
      SELECT array_to_json(array_agg(jobs)) as jobs FROM 
      (
        SELECT app_job.applied_id,job.job_id,job.job_title,job.job_type,job.job_description,job.job_status,job.created_at,app_job.selection_status,app_job.created_at,app_job.experience,app_job.description,
        app_job.skills,app_job.education,usr.full_name,usr.email,usr.user_id,usr.resume,usr.profile_picture FROM applied_jobs app_job 
        INNER JOIN users usr ON usr.user_id = app_job.user_id
        WHERE app_job.job_id=job.job_id 
        
      )jobs
    ) 
    FROM posted_jobs job 
    WHERE job.company_id='${company_id}' 
    ORDER BY job.created_at DESC;`;

    let rows = await sequelize.query(applicants_query);
    rows = rows[0].map((item) => {
      return item.jobs;
    });
    let newArr = [];
    for (let i = 0; i < rows.length; i++) {
      newArr = newArr.concat(rows[i]);
    }
    newArr = newArr.filter((item) => {
      return item != null;
    });

    if (!newArr.length) throw new Error("Not found");
    res.json({
      success: true,
      message: "Get total applicants successfully",
      totalApplicant: newArr.length,
      applicants: newArr,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
