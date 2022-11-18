const { templateCertificate } = require("../../utils/certificateTemplate");
const puppeteer = require("puppeteer-extra");
const { uploadFile } = require("../../services/uploadCertificate");
const path = require("path");

// puppeteer property
const puppeteerOptions = {
  headless: true,
  ignoreHTTPSErrors: true,
  args: [
    "--no-sandbox",
    "--single-process",
    "--no-zygote",
    "--disable-setuid-sandbox",
  ],
};

/**
 *
 * @param {*} EssentialInfo
 * @returns
 */

exports.saveCertificate = async (EssentialInfo) => {
  // It will fetch html content
  let html = templateCertificate(EssentialInfo);
  // it will load a browser
  let browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();

  await page.setViewport({
    width: 960,
    height: 760,
    deviceScaleFactor: 1,
  });
  // load html page
  await page.setContent(html, {
    waitUntil: ["load", "domcontentloaded", "networkidle0"],
  });
  // will take screenshot and store in folder
  let file = path.join(
    path.dirname(process.mainModule.filename),
    `/uploads/${EssentialInfo.user_name}_Certificate.png`
  );
  await page.screenshot({
    path: file,
  });
  await browser.close();

  let certificate_link = await uploadFile(file, EssentialInfo);
  return certificate_link;
};
