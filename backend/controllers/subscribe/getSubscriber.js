const { sequelize } = require("../../models");

exports.getSubscriberFromDb = async (req, res) => {
  try {
    const qry = `
        
        SELECT * FROM subscribers
        ORDER BY created_at DESC;

        `;
    const [getSubscriber] = await sequelize.query(qry);
    if (!getSubscriber.length) throw new Error("Not Found");
    return res.json({
      success: true,
      message: "Subscriber has been fetched",
      subscriber: getSubscriber,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};
