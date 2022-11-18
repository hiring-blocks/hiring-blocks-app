const { createContactInDB } = require("./post.contact");
const { getContactFromDb } = require("./getContact.contact");
const { deleteContactFromDb } = require("./deleteContact.contact");
module.exports = {
  createContactInDB,
  getContactFromDb,
  deleteContactFromDb,
};
