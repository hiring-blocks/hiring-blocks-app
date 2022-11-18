const { sequelize } = require("../../../models");

exports.getCompanyStats = async (req, res, next) => {
  try {
    let { company_id } = req.query;
    const { User } = req;
    let get_TotalCandidates;
    let stats = {};
    let get_TotalActiveJobs;
    let get_TotalClosedJobs;
    if (User.user_type === "user") throw new Error("Not found");
    const t = await sequelize.transaction();
    try {
      const query = `
      SELECT applied_applicant.* , usr.email,usr.full_name,usr.profile_picture from posted_jobs job 
      INNER JOIN applied_jobs applied_applicant ON applied_applicant.job_id = job.job_id
      INNER JOIN users usr ON usr.user_id = applied_applicant.user_id
      Where company_id = '${company_id}' AND applied_applicant.selection_status = 'Hired' 
              `;
      [get_TotalCandidates] = await sequelize.query(query, { transaction: t });
      [get_TotalActiveJobs] = await sequelize.query(
        `SELECT * from posted_jobs Where company_id = '${company_id}' AND job_status = 'ACTIVE'`,
        { transaction: t }
      );
      [get_TotalClosedJobs] = await sequelize.query(
        `SELECT * from posted_jobs Where company_id = '${company_id}' AND job_status = 'INACTIVE'`,
        { transaction: t }
      );
      await t.commit();
    } catch (error) {
      await t.rollback();
    }
    stats.total_Hiredcandidates = get_TotalCandidates.length;
    stats.total_active_jobs = get_TotalActiveJobs.length;
    stats.total_closed_jobs = get_TotalClosedJobs.length;
    stats.total_jobs =
      Number(get_TotalActiveJobs.length) + Number(get_TotalClosedJobs.length);
    stats.closedJobs = get_TotalClosedJobs;
    stats.activeJobs = get_TotalActiveJobs;
    stats.Hiredcandidates = get_TotalCandidates;
    return res.json({ success: true, message: null, stats: stats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
