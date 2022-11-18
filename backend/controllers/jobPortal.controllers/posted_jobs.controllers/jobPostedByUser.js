const { sequelize, posted_jobs } = require("../../../models");

exports.getPostedJobsByUser = async (req, res, next) => {
  try {
    const { User } = req;
    const { company_id } = req.query;
    if (User.user_type === "user") throw new Error("Not found");
    const t = await sequelize.transaction();
    let getJob;
    try {
      const query = `
      SELECT job.* , count(applied_id) as total_applied FROM posted_jobs job
	    Left outer join applied_jobs apl ON job.job_id = apl.job_id
      WHERE job.company_id = '${company_id}'
      group by job.job_id; 
        
        `;
      [getJob] = await sequelize.query(query, { transaction: t });

      await t.commit();
    } catch (error) {
      await t.rollback();
    }

    if (!getJob.length) throw new Error("Job not posted yet");
    return res.json({ success: true, message: null, jobs: getJob });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
