const { sequelize, company } = require("../../../models");
const { JobValidation } = require("../../../validation/postJob.validation");
const { v1 } = require("uuid");

exports.postJob = async (req, res) => {
  try {
    const { User } = req;
    // 1. get job detail and company id
    const {
      company_id,
      job_title,
      job_description,
      job_type, // place of job like work from home
      experience_level,
      working_hours,
      salary,
      skills_required,
      responsibilities,
      qualification,
      workplace,
      job_location,
      application_end_date,
      deadline,
      question1,
      question2,
      no_of_opening,
      job_or_internship,
    } = req.body;

    // 2. check all field are available
    if (User.user_type === "user") throw new Error("User can't post a job");
    const job_id = v1();
    const job_status = "ACTIVE";
    const checkCompany = await company.findOne({
      where: {
        company_id,
      },
    });
    if (!checkCompany) throw new Error("Please register your company");

    const deadline_date = new Date(
      new Date().getTime() + deadline * 24 * 60 * 60 * 1000
    ).toString();

    // 3 Insert a data into database
    let jsonExp = JSON.stringify(skills_required);
    const query = `
        INSERT INTO posted_jobs (
            job_id , job_title, job_description, job_type , experience_level , job_status , company_id ,working_hours,
            salary,
            skilles_required,
            responsibilities,
            qualification,
            application_end_date,
            workplace,
            job_location,
            deadline,
            question1,
            question2,
            no_of_opening,
            job_or_internship
        ) 
        VALUES (
            '${job_id}','${job_title}','${job_description}','${job_type}','${experience_level}','${job_status}','${company_id}','${working_hours}',
            '${salary}',
            '${jsonExp}',
            '${responsibilities}',
            '${qualification}',
            '${application_end_date}','${workplace}','${job_location}','${deadline_date}','${question1}','${question2}','${no_of_opening}','${job_or_internship}'
        )
        RETURNING *;
      `;
    const [getPostedJobs] = await sequelize.query(query);

    if (getPostedJobs.length)
      return res.json({
        success: true,
        message: "Job has been Posted",
        post: getPostedJobs,
      });
    else throw new Error("Failed to Post a Job");
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
