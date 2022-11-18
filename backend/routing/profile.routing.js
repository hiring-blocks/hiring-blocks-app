const express = require("express");
const { Auth } = require("../middleware/authentication");
const { updatePicture } = require("../controllers/Profile/changeProfile");
const { updateProfile } = require("../controllers/Profile/update.profile");
const { profileStat } = require("../controllers/Profile/statsProfile");
const path = require("path");

const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
router.put(
  "/update_pic",
  upload.fields([
    {
      name: "profile",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 1,
    },
  ]),
  Auth,
  updatePicture
);

router.put("/profile", Auth, updateProfile);
router.get("/profile-stats", Auth, profileStat);

module.exports = router;
