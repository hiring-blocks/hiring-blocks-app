const { sequelize, posted_jobs } = require("../../../models");

exports.removeJob = async (req, res, next) => {
  try {
    const { job_id } = req.query;
    const { User } = req;
    if (User.user_type === "user") throw new Error("Not found");
    if (!job_id) throw new Error("Please Provide a Job ID");
    const deleteJob = await posted_jobs.destroy({
      where: {
        job_id,
      },
    });
    if (!deleteJob) throw new Error("Job not removed");
    return res.json({ success: true, message: "Job removed successfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
