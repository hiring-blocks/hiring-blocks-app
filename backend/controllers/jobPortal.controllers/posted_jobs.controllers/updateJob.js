const { sequelize } = require("../../../models");

exports.updateJob = async (req, res, next) => {
  try {
    const { job_id } = req.body;
    const { User } = req;
    if (User.user_type === "user") throw new Error("Not found");
    if (!job_id) throw new Error("Please Provide a job ID");
    const set_case = [];
    if (req.body.job_title)
      set_case.push(`job_title = '${req.body.job_title}'`);
    if (req.body.job_description)
      set_case.push(`job_description='${req.body.job_description}'`);
    if (req.body.job_status)
      set_case.push(`job_status ='${req.body.job_status}'`);
    if (req.body.job_type) set_case.push(`job_type='${req.body.job_type}'`);
    if (req.body.experience_level)
      set_case.push(`experience_level='${req.body.experience_level}'`);
    if (req.body.working_hours)
      set_case.push(`working_hours='${req.body.working_hours}'`);
    if (req.body.salary) set_case.push(`salary='${req.body.salary}'`);
    if (req.body.skilles_required)
      set_case.push(`skilles_required='${req.body.skilles_required}'`);
    if (req.body.responsibilities)
      set_case.push(`responsibilities='${req.body.responsibilities}'`);
    if (req.body.qualification)
      set_case.push(`qualification='${req.body.qualification}'`);
    if (req.body.application_end_date)
      set_case.push(`application_end_date='${req.body.application_end_date}'`);

    const query = `
            UPDATE posted_jobs 
            SET  ${set_case.length ? set_case.join(",") : ""}
            WHERE job_id = '${req.body.job_id}'
            RETURNING *;
            `;
    const [updateJobsData] = await sequelize.query(query);

    if (!updateJobsData.length) throw new Error("job not updated");
    else res.json({ success: true, message: "Job updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
