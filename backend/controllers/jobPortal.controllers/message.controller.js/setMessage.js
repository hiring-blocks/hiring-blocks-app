const { sequelize, message } = require("../../../models");
const { v1 } = require("uuid");

exports.addMessage = async (req, res, next) => {
  try {
    const { to, message, job_id } = req.body;
    const { User } = req;
    if (!message.length) throw new Error("Please enter a message");
    const qry = `
            INSERT INTO messages(message_id,message,sender,receiver,job_id)
            VALUES(
                '${v1()}','${message}','${User.user_id}','${to}','${job_id}'
            )
            RETURNING *;
        `;
    const [data] = await sequelize.query(qry);
    if (data.length) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
