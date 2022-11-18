const { sequelize, applied_jobs } = require("../../../models");

exports.updateJobStatus = async (req, res, next) => {
  try {
    const { User } = req;
    const { status, applied_id } = req.query;
    if (User.user_type === "user" || User.user_type === null)
      throw new Error("You can't update status");
    if (!(status && applied_id))
      throw new Error("Please provide a status and applied_id");
    const qry = `
     SELECT * FROM applied_jobs WHERE applied_id = '${applied_id}'
    `;
    const [getJob] = await sequelize.query(qry);
    if (!getJob.length) throw new Error("Not found");
    const updateStatusQry = `
     UPDATE applied_jobs SET selection_status = '${status}'
     WHERE applied_id = '${applied_id}';
     
    `;
    await sequelize.query(updateStatusQry);
    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getJobsOnStatus = async (req, res, next) => {
  try {
    const { User } = req;
    const { status, job_id } = req.query;
    if (User.user_type === "user" || User.user_type === null)
      throw new Error("You can't access");
    if (!(status && job_id))
      throw new Error("Please provide a status and job_id ");
    const qry = `
    SELECT job.user_id,job.phone_number,job.applied_id,job.job_id,job.additional_question,p.job_title,p.job_type,p.job_description,p.job_status,p.created_at as job_created,p.qualification,p.salary,p.experience_level,p.working_hours,job.selection_status,job.updated_at,job.created_at,u.experience,u.description,u.skills,u.education,u.full_name,u.email,u.resume,u.profile_picture,u.cover_picture,u.title,u.other_info,u.certificates from applied_jobs job
        INNER join users u ON u.user_id = job.user_id
        INNER join posted_jobs p ON p.job_id = job.job_id
        WHERE job.job_id = '${job_id}' and job.selection_status = '${status}'
    `;
    const [getJob] = await sequelize.query(qry);
    if (!getJob.length) throw new Error("Not found");
    res.json({
      success: true,
      message: "Jobs got  successfully",
      getJob,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getJobsOrInternship = async (req, res, next) => {
  try {
    const { User } = req;
    const { status, company_id } = req.query;
    if (User.user_type === "user" || User.user_type === null)
      throw new Error("You can't access");
    if (!(status && company_id))
      throw new Error("Please provide a status and company_id ");
    const qry = `
    SELECT job.*,count(applied_id) as total_applied FROM posted_jobs job
 Left outer join applied_jobs apl ON apl.job_id = job.job_id 
     WHERE job_or_internship = '${status}' and company_id = '${company_id}'
     group by job.job_id
     `;
    const [getJob] = await sequelize.query(qry);
    if (!getJob.length) throw new Error("Not found");
    res.json({
      success: true,
      message: "Jobs got  successfully",
      getJob,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getJobsAppliedCount = async (req, res, next) => {
  try {
    const { User } = req;
    const { job_id } = req.query;
    if (User.user_type === "user" || User.user_type === null)
      throw new Error("You can't access");
    if (!job_id) throw new Error("Please provide a  job_id ");
    const qry = `
    SELECT selection_status,count(*) FROM applied_jobs  WHERE
    job_id = '${job_id}' GROUP BY selection_status
    `;
    const [getJobCount] = await sequelize.query(qry);
    res.json({
      success: true,
      message: "Jobs got  successfully",
      getJobCount,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

exports.getAppliedCandidates = async (req, res, next) => {
  try {
    const { User } = req;
    const { job_id } = req.query;

    if (User.user_type === "user" || User.user_type === null)
      throw new Error("You can't get applied jobs");
    if (!job_id) throw new Error("Please provide a job_id");
    const query = `

        SELECT job.user_id,job.phone_number,job.applied_id,job.job_id,job.additional_question,p.job_title,p.job_type,p.job_description,p.job_status,p.created_at as job_created,p.qualification,p.salary,p.experience_level,p.working_hours,job.selection_status,job.updated_at,job.created_at,u.experience,u.description,u.skills,u.education,u.full_name,u.email,u.resume,u.profile_picture,u.cover_picture,u.title,u.other_info,u.certificates from applied_jobs job
        INNER join users u ON u.user_id = job.user_id
        INNER join posted_jobs p ON p.job_id = job.job_id
        WHERE job.job_id = '${job_id}';

        `;
    const [getJobs] = await sequelize.query(query);
    if (!getJobs.length) throw new Error("Not found");
    res.json({
      success: true,
      message: "Get jobs successfully",
      total_applicant: getJobs.length,
      applied_jobs: getJobs,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
