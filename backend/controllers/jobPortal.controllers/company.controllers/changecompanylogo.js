const { uploadFile } = require("../../../services/uploadCompanylogo");
const { sequelize, company } = require("../../../models");
exports.updateLogo = async (req, res, next) => {
  try {
    const { company_id } = req.body;
    const file = req.file;
    if (file) {
      const getCompany = await company.findOne({
        where: {
          company_id,
        },
        raw: true,
      });

      if (!getCompany) throw new Error("Not found");
      uploadFile(file, getCompany)
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Logo updated successfully",
          });
        })
        .catch((err) => {
          res.json({ success: false, message: err.message });
        });
    } else throw new Error("Couldn't update logo'");
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
