// const bucket = require("../config/gcp");
const fleekStorage = require("@fleekhq/fleek-storage-js");
// const fs = require("fs");
// const config = require("../config/keys.json");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
const fs = require("fs");
const path = require("path");
const { sequelize } = require("../models/index");

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */
// exports.uploadFile = async (file, user) => {
//   const blob = bucket.file(file.originalname);
//   const blobStream = blob.createWriteStream({
//     resumable: false,
//   });
//   blobStream.on("error", (err) => console.log(err));

//   // let name = file.originalname;
//   // name = name.toLowerCase().replaceAll(" ", "_");
//   const publicUrl = `https://storage.googleapis.com/learningsystem/${blob.name}`;
//   await this.generatePublicUrl(user, publicUrl);
//   blobStream.on("finish", () => {
//     console.log("uploaded");
//   });

//   blobStream.end(file.buffer);
// };

exports.generatePublicUrl = async (user_id, url, filePath) => {
  try {
    //obtain the webview and webcontent links
    const qry = `
        UPDATE users SET resume = '${url}' WHERE user_id = '${user_id}'
      `;
    await sequelize.query(qry);
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log(error.message);
  }
};

exports.uploadFile = async (file, user) => {
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
    await this.generatePublicUrl(user.user_id, url, filePath);
    console.log("uploaded resume");
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};
