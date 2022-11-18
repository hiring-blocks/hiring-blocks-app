const { sequelize } = require("../../models");
const { ContactValidation } = require("../../validation/contact.validation");
const { v1 } = require("uuid");
exports.createContactInDB = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    let set_case = [];
    await ContactValidation.validateAsync(req.body, { abortEarly: false });
    if (name.length) set_case.push(`name = '${name}'`);
    if (subject.length) set_case.push(`subject = '${subject}'`);
    if (message.length) set_case.push(`message = '${message}'`);
    let qry = `
        INSERT INTO contacts (contact_id, name, email, subject, message)
        VALUES ('${v1()}', '${name}', '${email}', '${subject}', '${message}')
        RETURNING *;
      `;
    const [saveContact] = await sequelize.query(qry);
    if (!saveContact.length) throw new Error("Failed to save contact");
    return res.json({
      success: true,
      message: "Contact has been saved",
      contact: saveContact,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};
