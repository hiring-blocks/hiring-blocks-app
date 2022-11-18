const fleekStorage = require("@fleekhq/fleek-storage-js");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
const fs = require("fs");
const path = require("path");
// const bucket = require("../config/gcp");
// const config = require("../config/keys.json");
const { sequelize } = require("../models/index");
exports.generatePublicUrl = async (addCompany, url, filePath) => {
  try {
    //obtain the webview and webcontent links
    const qry = `
    UPDATE companies SET company_logo = '${url}' WHERE company_id = '${addCompany.company_id}'
    `;
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
// exports.uploadFile = async (file, company) => {
//   const blob = bucket.file(file.originalname);
//   const blobStream = blob.createWriteStream({
//     resumable: false,
//   });
//   blobStream.on("error", (err) => console.log(err));
//   const publicUrl = `https://storage.googleapis.com/learningsystem/${blob.name}`;
//   await this.generatePublicUrl(company, publicUrl);
//   blobStream.on("finish", () => {
//     console.log("uploaded");
//   });

//   blobStream.end(file.buffer);
// };

exports.uploadFile = async (file, company) => {
  try {
    // const readFile = fs.readFileSync(certificatePath);
    // const uploadedFile = await fleekStorage.upload({
    //   apiKey: process.env.apiKey,
    //   apiSecret: process.env.secret_key,
    //   key: company.company_name,
    //   bucket: "28b1bd28-6771-4878-b332-0a48ca4295bc-bucket/company_image",
    //   ContentType: file.mimetype,
    //   data: file.buffer,
    //   httpUploadProgressCallback: (event) => {
    //     console.log(Math.round((event.loaded / event.total) * 100) + "% done");
    //   },
    // });
    let token = process.env.web_storage;
    const storage = new Web3Storage({ token });
    let filePath = path.join(
      path.dirname(process.mainModule.filename),
      `/${file.path}`
    );
    const pathFiles = await getFilesFromPath(filePath);
    const cid = await storage.put(pathFiles);
    const url = `https://${cid}.ipfs.w3s.link/${file.filename}`;
    await this.generatePublicUrl(company, url, filePath);
    console.log("image uploaded");
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};
