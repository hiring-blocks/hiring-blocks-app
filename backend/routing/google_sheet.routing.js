const express = require("express");
const router = express.Router();
const google_sheet_Controller = require("../controllers/google_sheet.controller");

// ADMIN routes
router.route("/all_users").get(google_sheet_Controller.all_users);


// router.route("/loginAdminUsers").post(adminController.loginAdminUsers);
module.exports = router;
