const { contact } = require("../../models");

exports.deleteContactFromDb = async (req, res) => {
  try {
    const deleteContact = await contact.destroy({
      where: {
        contact_id: req.query.id,
      },
    });
    if (!deleteContact) throw new Error("Contact not removed");
    return res.json({ success: true, message: "contact removed successfully" });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};
