const path = require("path");
const fs = require("fs");
const bucket = require("../../../config/gcp");

exports.downloadFile = async (req, res) => {
  try {
    let { url } = req.query;
    url = url.split("/");
    url = url[url.length - 1].split("?")[0];
    let filePath = path.join(
      path.dirname(process.mainModule.filename),
      `/uploads/${url.toLowerCase().replace(/\s/g, "_")}`
    );
    const downlaodOptions = {
      destination: filePath,
    };
    await bucket.file(url).download(downlaodOptions);

    res.set({
      "Content-Type": "application/pdf",
    });
    res.download(filePath, (err) => {
      if (err) throw new Error(err);
      else {
        fs.unlink(filePath, (err) => {
          if (err) throw new Error(err);
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
