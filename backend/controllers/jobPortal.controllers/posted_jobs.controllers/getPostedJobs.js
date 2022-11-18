const { sequelize, posted_jobs } = require("../../../models");

exports.getPostedJobs = async (req, res, next) => {
  try {
    const { User } = req;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You must be user");
    const LIMIT = 10;
    let page = req.query.page || 0;
    const qry = `SELECT job_id from bookmarks where user_id='${User.user_id}';
    `;
    const qry2 = `SELECT job_id from applied_jobs where user_id='${User.user_id}';
    `;
    const [getBookmark] = await sequelize.query(qry);
    const [getApplied] = await sequelize.query(qry2);
    const query = `
    select job.*,company.* from posted_jobs job
    INNER JOIN companies company ON job.company_id = company.company_id
    Where job_status = 'ACTIVE'
    ORDER BY job.created_at DESC
    LIMIT ${LIMIT} offset ${LIMIT * page};
        `;
    const [jobs] = await sequelize.query(query);
    if (jobs.length) {
      for (let j = 0; j < jobs.length; j++) {
        jobs[j].isBookmarked = false;
        jobs[j].isApplied = false;
      }
    }
    if (getBookmark.length) {
      for (let i = 0; i < getBookmark.length; i++) {
        for (let j = 0; j < jobs.length; j++) {
          if (getBookmark[i].job_id === jobs[j].job_id) {
            jobs[j].isBookmarked = true;
          }
        }
      }
    }
    if (getApplied.length) {
      for (let i = 0; i < getApplied.length; i++) {
        for (let j = 0; j < jobs.length; j++) {
          if (getApplied[i].job_id === jobs[j].job_id) {
            jobs[j].isApplied = true;
          }
        }
      }
    }
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

exports.getTotalJobs = async (req, res) => {
  try {
    const qry = `
      SELECT COUNT(*) FROM posted_jobs;
      `;
    const [totalJobs] = await sequelize.query(qry);
    if (!totalJobs.length) throw new Error("Job not created yet");
    res.json({
      success: true,
      message: "fetch total jobs successfully",
      totalJobs: totalJobs[0],
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getRecentJobs = async (req, res, next) => {
  try {
    const LIMIT = 9;
    const query = `
    select job.*,company.* from posted_jobs job
    INNER JOIN companies company ON job.company_id = company.company_id
    Where job_status = 'ACTIVE'
    ORDER BY job.created_at DESC
    LIMIT ${LIMIT};
        `;
    const [jobs] = await sequelize.query(query);

    return res.json({
      success: true,
      message: "Recently posted jobs",
      jobs,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
exports.getRecentJobsForCandidates = async (req, res, next) => {
  try {
    const { User } = req;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You must be user");
    const LIMIT = 9;
    const qry = `SELECT job_id from bookmarks where user_id='${User.user_id}';
                  `;
    const qry2 = `SELECT job_id from applied_jobs where user_id='${User.user_id}';
                  `;
    const [getBookmark] = await sequelize.query(qry);
    const [getApplied] = await sequelize.query(qry2);
    const query = `
    select job.*,company.* from posted_jobs job
    INNER JOIN companies company ON job.company_id = company.company_id
    Where job_status = 'ACTIVE'
    ORDER BY job.created_at DESC
    LIMIT ${LIMIT};
        `;
    const [jobs] = await sequelize.query(query);
    if (jobs.length) {
      for (let j = 0; j < jobs.length; j++) {
        jobs[j].isBookmarked = false;
        jobs[j].isApplied = false;
      }
    }
    if (getBookmark.length) {
      for (let i = 0; i < getBookmark.length; i++) {
        for (let j = 0; j < jobs.length; j++) {
          if (getBookmark[i].job_id === jobs[j].job_id) {
            jobs[j].isBookmarked = true;
          }
        }
      }
    }
    if (getApplied.length) {
      for (let i = 0; i < getApplied.length; i++) {
        for (let j = 0; j < jobs.length; j++) {
          if (getApplied[i].job_id === jobs[j].job_id) {
            jobs[j].isApplied = true;
          }
        }
      }
    }
    return res.json({
      success: true,
      message: "Recently posted jobs",
      jobs,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
