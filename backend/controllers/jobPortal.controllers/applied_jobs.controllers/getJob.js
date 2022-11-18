const { sequelize, applied_jobs } = require("../../../models");

exports.filterJob = async (req, res, next) => {
  try {
    const { User } = req;
    const { status } = req.query;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You can't get applied jobs");
    if (status) {
      const query = ` SELECT * FROM applied_jobs 
            INNER JOIN posted_jobs ON applied_jobs.job_id = posted_jobs.job_id
          WHERE user_id = '${User.user_id}' AND selection_status = '${status}'`;
      const [getJobs] = await sequelize.query(query);
      if (!getJobs.length) throw new Error("Not found");
      res.json({
        success: true,
        message: "Get jobs successfully",
        applied_jobs: getJobs,
      });
    } else {
      const query = ` SELECT * FROM applied_jobs 
            INNER JOIN posted_jobs ON applied_jobs.job_id = posted_jobs.job_id
          WHERE user_id = '${User.user_id}'`;
      const [getJobs] = await sequelize.query(query);
      if (!getJobs.length) throw new Error("Not found");
      res.json({
        success: true,
        message: "Get jobs successfully",
        applied_jobs: getJobs,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getSpecificJob = async (req, res) => {
  try {
    const { User } = req;
    const { job_id } = req.query;
    if (!job_id) throw new Error("Please provide a job_id");
    const query = `
        
        SELECT * from posted_jobs job
        INNER join companies company ON company.company_id = job.company_id
        WHERE job.job_id = '${job_id}';

        `;
    const [getJobs] = await sequelize.query(query);
    const qry = `SELECT job_id from bookmarks where user_id='${User.user_id}';`;
    const qry2 = `SELECT job_id from applied_jobs where user_id='${User.user_id}';`;
    const [getApplied] = await sequelize.query(qry2);
    const [getBookmark] = await sequelize.query(qry);
    if (!getJobs.length) throw new Error("Not found");
    if (getJobs.length) {
      for (let j = 0; j < getJobs.length; j++) {
        getJobs[j].isBookmarked = false;
        getJobs[j].isApplied = false;
      }
    }
    if (getBookmark.length) {
      for (let i = 0; i < getBookmark.length; i++) {
        for (let j = 0; j < getJobs.length; j++) {
          if (getBookmark[i].job_id === getJobs[j].job_id) {
            getJobs[j].isBookmarked = true;
          }
        }
      }
    }
    if (getApplied.length) {
      for (let i = 0; i < getApplied.length; i++) {
        for (let j = 0; j < getJobs.length; j++) {
          if (getApplied[i].job_id === getJobs[j].job_id) {
            getJobs[j].isApplied = true;
          }
        }
      }
    }

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
