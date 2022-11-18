const bucket = require("../config/gcp");
const config = require("../config/keys.json");
const { sequelize } = require("../models/index");
const path = require("path");
const fs = require("fs");

exports.generatePublicUrl = async (EssentialInfo, url) => {
  try {
    let filePath = path.join(
      path.dirname(process.mainModule.filename),
      `/uploads/${EssentialInfo.user_name}_Certificate.png`
    );
    let setCases = [];
    let url1 = [url];
    if (url1) {
      let jsonEdu = JSON.stringify(url1);
      setCases.push(`certificates = '${jsonEdu}'`);
    }
    //obtain the webview and webcontent links
    const qry = `
        UPDATE users SET ${setCases.join(",")} WHERE user_id = '${
      EssentialInfo.user_id
    }'
      `;
    await sequelize.query(qry);
    fs.unlink(filePath, function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
  } catch (error) {
    console.log(error.message);
  }
};

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */
exports.uploadFile = async (file, EssentialInfo) => {
  await bucket.upload(file);
  const publicUrl = `https://storage.googleapis.com/learningsystem/${EssentialInfo.user_name}_Certificate.png`;
  await this.generatePublicUrl(EssentialInfo, publicUrl);
  return publicUrl;
};
