exports.profileStat = async (req, res, next) => {
  try {
    let property = 0;
    const { User } = req;

    if (User.mobile_no === null) {
      property++;
    }
    if (User.email === null) {
      property++;
    }
    if (User.skills === null) {
      property++;
    }
    if (User.experience === null) {
      property++;
    }
    if (User.education === null) {
      property++;
    }
    if (User.description === null) {
      property++;
    }
    if (User.certificates === null) {
      property++;
    }
    if (User.title === null) {
      property++;
    }
    if (User.profile_picture === null) {
      property++;
    }
    if (User.resume === null) {
      property++;
    }

    let percentage = (property / 10) * 100;
    let updatedProfile = User.updatedAt;

    res.json({
      sucess: true,
      percentageLeft: percentage,
      profileLastUpdatedAt: updatedProfile,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
