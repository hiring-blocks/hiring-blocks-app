const { sequelize } = require("../../../models");
const { v1 } = require("uuid");
exports.getCompanyHistory = async (req, res, next) => {
  try {
    const { User } = req;
    if (User.user_type === "user" || User.user_type === null)
      throw new Error("You must be company");
    const messageQry = `   
    select 
    array_to_json(array_agg(json_build_object('messageSendat',msg.created_at,'job_title',job.job_title,'job_id',job.job_id,'Name',usr.full_name,'email',usr.email,
											  'profile_pic',usr.profile_picture,'user_id',usr.user_id,'job_id',job.job_id)))
    from messages msg
    INNER JOIN posted_jobs job ON job.job_id = msg.job_id
    INNER JOIN users usr ON usr.user_id = msg.receiver
    WHERE msg.sender = '${User.user_id}'
	  GROUP BY msg.receiver
    `;
    let [getMessages] = await sequelize.query(messageQry);
    getMessages = getMessages.map((item) => {
      if (item !== null) {
        return item.array_to_json[0];
      }
    });
    let newArr = [];
    for (let i = 0; i < getMessages.length; i++) {
      newArr = newArr.concat(getMessages[i]);
    }
    if (!newArr.length) throw new Error("Messages Not found");
    res.json({ sucess: true, history: newArr });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
