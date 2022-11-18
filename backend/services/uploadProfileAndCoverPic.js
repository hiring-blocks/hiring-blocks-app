const bucket = require("../config/gcp");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
const fs = require("fs");
const path = require("path");
const fleekStorage = require("@fleekhq/fleek-storage-js");
const { sequelize } = require("../models/index");
exports.generatePublicUrl = async (user, url, type, filePath) => {
  try {
    let qry;
    if (type === "cover") {
      qry = `
        UPDATE users SET cover_picture = '${url}' WHERE user_id = '${user}'
      `;
    }
    if (type === "profile") {
      qry = `
        UPDATE users SET profile_picture = '${url}' WHERE user_id = '${user}'
      `;
    }
    await sequelize.query(qry);
    fs.unlinkSync(filePath);
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
// exports.uploadCover = async (file, user, type) => {
//   const blob = bucket.file(file.originalname);
//   const blobStream = blob.createWriteStream({
//     resumable: false,
//   });
//   blobStream.on("error", (err) => console.log(err));
//   const publicUrl = `https://storage.googleapis.com/learningsystem/${blob.name}`;
//   await this.generatePublicUrl(user, publicUrl, type);
//   blobStream.on("finish", () => {
//     console.log("uploaded");
//   });

//   blobStream.end(file.buffer);
// };

exports.uploadCover = async (file, user, type) => {
  try {
    // const readFile = fs.readFileSync(certificatePath);
    let token = process.env.web_storage;
    const storage = new Web3Storage({ token });
    let filePath = path.join(
      path.dirname(process.mainModule.filename),
      `/${file.path}`
    );
    const pathFiles = await getFilesFromPath(filePath);
    const cid = await storage.put(pathFiles);
    const url = `https://${cid}.ipfs.w3s.link/${file.filename}`;
    await this.generatePublicUrl(user.user_id, url, type, filePath);
    console.log("image uploaded");
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};
