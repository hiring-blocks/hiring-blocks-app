const { sequelize, posted_jobs } = require("../../../models");
const { v1 } = require("uuid");
exports.applyJob = async (req, res) => {
  try {
    const { User } = req;
    const {
      job_id,
      description,
      experience,
      email,
      phone_number,
      additional_question,
      resume,
    } = req.body;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You can't apply for job");

    const getJobDetailsQuery = `
        SELECT * FROM posted_jobs WHERE job_id = '${job_id}' AND job_status = 'ACTIVE';
      `;
    const [checkJob] = await sequelize.query(getJobDetailsQuery);
    if (!checkJob.length) throw new Error("Job has been closed");
    const checkquery = ` SELECT * FROM applied_jobs WHERE job_id = '${job_id}' AND user_id = '${User.user_id}'`;
    const [checkJobExist] = await sequelize.query(checkquery);
    if (checkJobExist.length) throw new Error("You applied already");
    const selection_status = "Applied";
    const query = ` INSERT INTO applied_jobs (

            applied_id , job_id , user_id , selection_status,experience , description,email,additional_question,phone_number,resume

        ) VALUES ('${v1()}','${job_id}', '${
      User.user_id
    }', '${selection_status}','${experience}', '${description}','${email}','${additional_question}','${phone_number}', '${resume}')
        RETURNING *;
        `;
    const [applied] = await sequelize.query(query);
    if (!applied.length) throw new Error("Job not created yet");
    res.json({
      success: true,
      message: "Applied successfully",
      job: applied,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
