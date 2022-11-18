const { user, notification } = require("../../models");

exports.getNotification = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("id must be provided");
    let user_data = await user.findOne({ where: { user_id: id }, raw: true });
    if (!user_data) throw new Error("User not found");
    const getAllNotifications = await notification.findAll({
      where: { user_id: id, status: "unread" },
      raw: true,
    });
    if (!getAllNotifications.length) throw new Error("No notifications found");
    res.json({
      success: true,
      notifications: getAllNotifications,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
