const { uploadCover } = require("../../services/uploadProfileAndCoverPic.js");
exports.updatePicture = async (req, res, next) => {
  try {
    const { User } = req;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You must be a user to view your profile");
    if (req.files) {
      if (req.files.cover) {
        uploadCover(req.files.cover[0], User, "cover")
          .then(() => {
            res.status(200).json({
              success: true,
              message: "Cover picture updated successfully",
            });
          })
          .catch((err) => res.json({ success: false, message: err.message }));
      }
      if (req.files.profile) {
        uploadCover(req.files.profile[0], User, "profile")
          .then(() => {
            res.status(200).json({
              success: true,
              message: "Profile picture updated successfully",
            });
          })
          .catch((err) => {
            res.json({ success: false, message: err.message });
          });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
