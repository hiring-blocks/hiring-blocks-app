const { uploadFile } = require("../../../services/uploadResume");
exports.uploadResume = async (req, res) => {
  try {
    const { User } = req;
    if (User.user_type === "company") throw new Error("Can't upload resume");
    if (req.file) {
      const file = req.file;
      const user_id = User.user_id;
      uploadFile(file, User)
        .then(() => {
          res.json({
            success: true,
            message: "Resume Uploaded successfully",
          });
        })
        .catch((error) => console.log(error));
    }
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
