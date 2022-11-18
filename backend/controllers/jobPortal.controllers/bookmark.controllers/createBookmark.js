const { sequelize, bookmark, posted_jobs } = require("../../../models");
const { v1 } = require("uuid");
exports.createBookmark = async (req, res, next) => {
  try {
    const { User } = req;
    const { job_id } = req.query;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You must be user");
    if (!job_id) throw new Error("Please Provide a job ID");
    const [getJob] = await sequelize.query(
      `SELECT * FROM posted_jobs WHERE job_id = '${job_id}'`
    );
    if (!getJob.length) throw new Error("Job not found");
    if (!getJob.status === "Closed") throw new Error("Job had been closed");
    const bookmark_id = v1();
    const getBookmarks = await bookmark.findOne({
      where: {
        job_id,
        user_id: User.user_id,
      },
    });
    if (getBookmarks) throw new Error("Bookmark already exists");
    const createBookmarkQuery = `
    
      INSERT INTO bookmarks
      (
        bookmark_id,job_id ,user_id
      )
      VALUES (
        '${bookmark_id}','${job_id}','${User.user_id}'
       )
        RETURNING *;
    `;
    const [createBookmark] = await sequelize.query(createBookmarkQuery);
    if (!createBookmark.length) throw new Error("Bookmark not created yet");
    res.json({ success: true, message: "Job has been bookmarked" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
