const { sequelize } = require("../../models");
const { v1 } = require("uuid");
exports.Subscriber = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) throw new Error("Please enter a valid email");
    const qry = `
        INSERT INTO subscribers (subscriber_id, email)
        VALUES ('${v1()}', '${email}')
        RETURNING *;
        `;
    const [subscribers] = await sequelize.query(qry);
    if (!subscribers.length) throw new Error("Failed to save subscriber");
    return res.json({
      success: true,
      message: "Subscriber has been created",
      subscribers: subscribers,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
