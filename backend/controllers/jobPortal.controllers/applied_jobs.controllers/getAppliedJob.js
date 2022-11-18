const { sequelize, applied_jobs } = require("../../../models");

exports.getAppliedJobs = async (req, res, next) => {
  try {
    const { User } = req;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You can't get applied jobs");
    const query = ` SELECT * FROM applied_jobs 
        INNER JOIN posted_jobs ON applied_jobs.job_id = posted_jobs.job_id
        INNER JOIN companies ON posted_jobs.company_id = companies.company_id
        WHERE applied_jobs.user_id = '${User.user_id}'
        ORDER BY applied_jobs.created_at DESC
        `;
    const [getJobs] = await sequelize.query(query);
    if (!getJobs.length) throw new Error("Not found");
    res.json({
      success: true,
      message: "Get jobs successfully",
      applied_jobs: getJobs,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getAppliedJobsById = async (req, res, next) => {
  try {
    const { User } = req;
    const { jobId } = req.query;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You can't get applied jobs");
    const query = ` SELECT * FROM applied_jobs 
    WHERE user_id = '${User.user_id}' AND job_id = '${jobId}'`;
    const [getJobsById] = await sequelize.query(query);
    if (!getJobsById.length) throw new Error("Not found");
    res.json({
      success: true,
      message: "Get jobs successfully",
      applied_jobs: getJobsById,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
