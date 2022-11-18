const { user, notification } = require("../../models");

exports.addNotification = async (req, res) => {
  try {
    const { user_id, title, description } = req.body;
    if (!user_id) throw new Error("user_id must be provided");
    if (!title) throw new Error("title must be provided");
    if (!description) throw new Error("description must be provided");
    let user_data = await user.findOne({
      where: { user_id: user_id },
      raw: true,
    });
    if (!user_data) throw new Error("User not found");
    const status = "unread";
    const addNotification = await notification.create({
      title,
      description,
      user_id,
      status,
    });
    if (!addNotification) throw new Error("Notification not added");
    res.json({
      success: true,
      message: "Notification added successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { notification_id } = req.query;
    if (!status) throw new Error("status must be provided");
    if (!notification_id) throw new Error("notification_id must be provided");
    let getNotification = await notification.findOne({
      where: { notification_id: notification_id },
      raw: true,
    });
    const status = "unread";
    if (!getNotification) throw new Error("Notification not found");
    getNotification.status = status;
    await getNotification.save();
    res.json({
      success: true,
      message: "Notification status updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
