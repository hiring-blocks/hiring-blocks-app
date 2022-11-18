const {
  sequelize,
  posted_jobs,
  bookmark,
  applied_jobs,
} = require("../../../models");

exports.getUserJobStats = async (req, res, next) => {
  try {
    const { User } = req;

    const filledJobs_query = ` SELECT COUNT(*) FROM applied_jobs where user_id='${User.user_id}'`;

    const savedJobs_query = ` SELECT COUNT(*) FROM bookmarks where user_id='${User.user_id}'`;

    const [totalFilledJobs] = await sequelize.query(filledJobs_query);
    const [totalSavedJobs] = await sequelize.query(savedJobs_query);
    let job_offers = 0;
    let posted_jobs = 0;
    if (!totalFilledJobs.length) throw new Error("Not found");
    if (!totalSavedJobs.length) throw new Error("Not found");

    res.json({
      success: true,
      message: "Get applied,saved jobs successfully",
      totalFilledJobs: totalFilledJobs[0],
      totalSavedJobs: totalSavedJobs[0],
      job_offers: job_offers,
      posted_jobs: posted_jobs,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
