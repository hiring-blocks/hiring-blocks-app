const { sequelize, posted_jobs, user, company } = require("../../../models");

exports.getRecommendedJobs = async (req, res, next) => {
  try {
    const { User } = req;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You must be user");
    const query1 = `
        select job.*,company.* from posted_jobs job
        INNER JOIN companies company ON job.company_id = company.company_id
        where job_title ilike '%${User.preference1}%' OR job_description ilike '%${User.preference1}%' OR skilles_required::text like '%${User.preference1}%'  
        AND job_status = 'ACTIVE'
        ORDER BY job.created_at ASC Limit 6;
        `;

    const query2 = `
        select job.*,company.* from posted_jobs job
        INNER JOIN companies company ON job.company_id = company.company_id
        where job_title ilike '%${User.preference2}%' OR job_description ilike '%${User.preference2}%' OR skilles_required::text like '%${User.preference2}%'  
        AND job_status = 'ACTIVE'
        ORDER BY job.created_at ASC Limit 6;
        `;
    const qry = `SELECT job_id from bookmarks where user_id='${User.user_id}';
        `;
    const qry2 = `SELECT job_id from applied_jobs where user_id='${User.user_id}';
        `;
    const [getApplied] = await sequelize.query(qry2);
    const [getBookmark] = await sequelize.query(qry);
    const [jobs1] = await sequelize.query(query1);
    const [jobs2] = await sequelize.query(query2);
    if (jobs1.length) {
      for (let j = 0; j < jobs1.length; j++) {
        jobs1[j].isBookmarked = false;
        jobs1[j].isApplied = false;
      }
    }
    if (jobs2.length) {
      for (let j = 0; j < jobs2.length; j++) {
        jobs2[j].isBookmarked = false;
        jobs2[j].isApplied = false;
      }
    }
    if (getBookmark.length) {
      for (let i = 0; i < getBookmark.length; i++) {
        for (let j = 0; j < jobs1.length; j++) {
          if (getBookmark[i].job_id === jobs1[j].job_id) {
            jobs1[j].isBookmarked = true;
          }
        }
      }
      for (let i = 0; i < getBookmark.length; i++) {
        for (let j = 0; j < jobs2.length; j++) {
          if (getBookmark[i].job_id === jobs2[j].job_id) {
            jobs2[j].isBookmarked = true;
          }
        }
      }
    }
    if (getApplied.length) {
      for (let i = 0; i < getApplied.length; i++) {
        for (let j = 0; j < jobs1.length; j++) {
          if (getApplied[i].job_id === jobs1[j].job_id) {
            jobs1[j].isApplied = true;
          }
        }
      }
      for (let i = 0; i < getApplied.length; i++) {
        for (let j = 0; j < jobs2.length; j++) {
          if (getApplied[i].job_id === jobs2[j].job_id) {
            jobs2[j].isApplied = true;
          }
        }
      }
    }
    return res.json({
      success: true,
      message:
        "Successfully got search results of jobs according to preferences",
      totaljobs1: jobs1.length,
      totaljobs2: jobs2.length,
      jobs1: jobs1,
      jobs2: jobs2,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
