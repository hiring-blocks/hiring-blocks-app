const {
  user_course_percentage,
  Course,
  user,
  order_courses,
} = require("../../models");
const { saveCertificate } = require("./saveCertificate");
exports.ClaimCertificate = async (req, res) => {
  try {
    const { course_id, user_id } = req.query;
    if (!user_id && !course_id)
      throw new Error("course and user id must be provided");

    let user_data = await user.findOne({ where: { user_id }, raw: true });
    if (!user_data) throw new Error("User not found");
    let exists = await order_courses.findOne({
      where: {
        product_id: course_id,
        email: user_data.email,
      },
      raw: true,
    });
    if (!exists) throw new Error("Course must be purchased");

    let course_percentage = await user_course_percentage.findOne({
      where: { user_id, course_id },
      raw: true,
      attributes: ["percentage_watched", "course_id", "user_id"],
    });
    let courses = await Course.findOne({
      where: { course_id },
      raw: true,
      attributes: ["course_name"],
    });
    course_percentage.order_id = exists.order_courses_id;
    course_percentage.user_name = user_data.full_name;
    course_percentage.course_name = courses.course_name;

    if (
      course_percentage.percentage_watched == "100.00" ||
      course_percentage.percentage_watched == "100"
    ) {
      let link = await saveCertificate(course_percentage);
      res.json({
        success: true,
        message: "Certificate claimed successfully",
        certificate: link,
      });
    } else throw new Error("Please complete the course");
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};
