const { sequelize, message, company } = require("../../../models");
const { v1 } = require("uuid");
exports.getMessages = async (req, res, next) => {
  try {
    const { User } = req;
    const { to, job_id, page } = req.body;
    let Limit = 50;
    console.log(page);
    let offsetRows = (page - 1) * Limit;
    const messageQry = `
    SELECT sender, receiver, message, created_at
    FROM messages
    WHERE sender = '${User.user_id}' AND receiver = '${to}' AND job_id = '${job_id}'
    OR message_id
    IN 
    (
      SELECT message_id from messages WHERE sender = '${to}' 
      AND receiver = '${User.user_id}'  AND job_id = '${job_id}'
    )
    ORDER BY created_at DESC
    LIMIT 50 OFFSET ${offsetRows} 
      `;
    const getTotalMessagesqry = `
    SELECT COUNT(sender)
    FROM messages
    WHERE sender = '${User.user_id}' AND receiver = '${to}' AND job_id = '${job_id}'
    OR message_id
    IN 
    (
      SELECT message_id from messages WHERE sender = '${to}' 
      AND receiver = '${User.user_id}'  AND job_id = '${job_id}'
    )
      `;
    // const logoQuery = `
    // SELECT *
    // FROM companies
    // WHERE company_id
    // IN
    // (
    //   SELECT company_id FROM messages msg
    //         INNER JOIN posted_jobs job ON msg.job_id=job.job_id
    // )
    // `;
    const [getTotalMessages] = await sequelize.query(getTotalMessagesqry);
    const [getMessages] = await sequelize.query(messageQry);
    // const [logo] = await sequelize.query(logoQuery);
    if (!getMessages.length) throw new Error("Messages Not found");
    const projectedMessages = getMessages.map((msg) => {
      let time = new Date(msg.created_at).getTime() + 330 * 60000;
      time = new Date(time).toLocaleString({ timeZone: "Asia/Kolkata" });
      return {
        fromSelf: msg.sender.toString() === User.user_id.toString(),
        to: msg.receiver,
        message: msg.message,
        createdAt: time,
      };
    });
    res.json({
      sucess: true,
      getTotalMessages: getTotalMessages,
      projectedMessages: projectedMessages.length ? projectedMessages : [],
      // logo: logo,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
