const { sequelize } = require("../../models");

exports.getContactFromDb = async (req, res) => {
  try {
    const qry = `
        
        SELECT name,subject,message,email FROM contacts
        ORDER BY created_at DESC;

        `;
    const [getContact] = await sequelize.query(qry);
    if (!getContact.length) throw new Error("Not Found");
    return res.json({
      success: true,
      message: "Contact has been fetched",
      contacts: getContact,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};
