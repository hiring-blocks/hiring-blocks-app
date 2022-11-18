const cron = require("node-cron");
const { sequelize } = require("../models");
let today = new Date().toString();

exports.jobScheduler = async function () {
  console.log("Cron Job Started");

  cron.schedule("0 */12 * * *", async () => {
    //at every 12 hours
    try {
      await sequelize.query(
        ` UPDATE posted_jobs 
        SET job_status = 'INACTIVE' 
        WHERE deadline < '${today}' AND job_status = 'ACTIVE' 
        RETURNING *
        `
      );
    } catch (err) {
      console.log(err.message);
      res.json({ success: false, message: err.message });
    }
  });
};
