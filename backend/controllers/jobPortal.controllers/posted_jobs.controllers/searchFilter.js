const { sequelize } = require("../../../models");

exports.filterSearch = async (req, res, next) => {
  try {
    let { title, location, skills, job_type, lower_salary, higher_salary } =
      req.body;

    if (title.length) {
      title = title.map((item) => `%${item.value}%`);
    } else title = `%%`;
    if (skills.length) {
      skills = skills.map((item) => `%${item.value}%`);
    } else skills = `%%`;
    if (location.length) {
      location = location.map((item) => `%${item.value}%`);
    } else location = `%%`;

    if (job_type.length) {
      job_type = job_type.map((item) => `%${item.value}%`);
    } else job_type = `%%`;
    let query = `
        select job.*,company.* from posted_jobs job
        INNER JOIN companies company ON job.company_id = company.company_id
        where job_title::text like '${title}' OR job_description::text like '${title}' OR skilles_required::text like '${skills}' OR job_location = '${location}' OR job_type::text like '${job_type}' OR (salary between '${lower_salary}' AND '${higher_salary}') AND job_status = 'ACTIVE'
        ORDER BY job.created_at ASC ;
        `;

    let [filtered_jobs] = await sequelize.query(query);

    return res.json({
      success: true,
      message:
        "Successfully got search results of jobs according to filters applied",
      totaljobs: filtered_jobs.length,
      jobs: filtered_jobs,
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
