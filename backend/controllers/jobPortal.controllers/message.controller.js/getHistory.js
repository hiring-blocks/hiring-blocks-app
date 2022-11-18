const { sequelize } = require("../../../models");
const { v1 } = require("uuid");
exports.getHistory = async (req, res, next) => {
  try {
    const { User } = req;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You must be user");
    const messageQry = `
      
    SELECT 
    (
        SELECT array_to_json(array_agg(job  ORDER BY msg.created_at DESC)) AS job FROM
        (
            SELECT job.*,company.* FROM posted_jobs job 
            INNER JOIN companies company ON company.company_id = job.company_id
            WHERE job.job_id = msg.job_id
        ) job 
    )
    FROM messages msg
    WHERE sender = '${User.user_id}' OR receiver = '${User.user_id}'

      `;
    let [getMessages] = await sequelize.query(messageQry);
    const map = {};
    getMessages = getMessages.map((item) => {
      if (item.job !== null) {
        if (item.job[0].job_id !== map[item.job[0].job_id]) {
          map[item.job[0].job_id] = item.job[0].job_id;
          return item;
        }
      }
    });
    getMessages = getMessages.filter((item) => {
      return item !== undefined || null;
    });
    if (!getMessages.length) throw new Error("Messages Not found");
    res.json({ sucess: true, getMessages });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
