const { sequelize } = require("../../models");
exports.updateProfile = async (req, res, next) => {
  try {
    let setCases = [];
    const { User } = req;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You must be a user to update your profile");
    if (req.body.full_name)
      setCases.push(`full_name = '${req.body.full_name}'`);
    if (req.body.mobile_no)
      setCases.push(`mobile_no = '${req.body.mobile_no}'`);
    if (req.body.title) setCases.push(`title = '${req.body.title}'`);
    if (req.body.preference1)
      setCases.push(`preference1 = '${req.body.preference1}'`);
    if (req.body.preference2)
      setCases.push(`preference2 = '${req.body.preference2}'`);
    if (req.body.experience) {
      let jsonExp = JSON.stringify(req.body.experience);
      setCases.push(`experience = '${jsonExp}'`);
    }
    if (req.body.addNote) {
      setCases.push(`addnote = '${req.body.addNote}'`);
    }
    if (req.body.description)
      setCases.push(`description = '${req.body.description}'`);
    if (req.body.skills) {
      let jsonskills = JSON.stringify(req.body.skills);
      setCases.push(`skills = '${jsonskills}'`);
    }
    if (req.body.education) {
      let jsonEdu = JSON.stringify(req.body.education);
      setCases.push(`education = '${jsonEdu}'`);
    }
    if (req.body.certificates) {
      let jsonEdu = JSON.stringify(req.body.certificates);
      setCases.push(`certificates = '${jsonEdu}'`);
    }
    if (req.body.other_info) {
      let jsonEdu = JSON.stringify(req.body.other_info);
      setCases.push(`other_info = '${jsonEdu}'`);
    }
    console.log(setCases);
    const qry = `UPDATE users SET ${setCases.join(",")} WHERE user_id = '${
      User.user_id
    }' RETURNING *`;
    const [updated] = await sequelize.query(qry);
    if (!updated.length) throw new Error("Profile not updated");
    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
