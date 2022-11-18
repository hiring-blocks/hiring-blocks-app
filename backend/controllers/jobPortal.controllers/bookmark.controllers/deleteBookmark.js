const { bookmark, posted_jobs, sequelize } = require("../../../models");

exports.deleteBookmarks = async (req, res) => {
  try {
    const {User}=req;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You must be user");
    const {bookmark_id}=req.query;
    if(!bookmark_id) throw new Error("Please provide a valid bookmark ID");
    const delBookmark= await sequelize.query(
        `DELETE FROM bookmarks WHERE bookmark_id = '${bookmark_id}'`
    );
    res.json({success: true,message:"Bokmark removed successfully",delBookmark})
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
