const { sequelize, user } = require("../../../models");
const { v1 } = require("uuid");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../../../services/uploadCompanylogo");

const UpdateInfo = async (user_id, details) => {
  try {
    //obtain the webview and webcontent links
    const qry = `
        UPDATE users SET verified = 'true',user_type = 'company' WHERE user_id = '${user_id}'
      `;
    await sequelize.query(qry);
  } catch (error) {
    console.log(error.message);
  }
};
const validateMetaLogin = async (user, signature) => {
  const ethUtil = require("ethereumjs-util");
  const { recoverPersonalSignature } = require("eth-sig-util");
  const msg = `${user.nonce}`;
  // Convert msg to hex string
  // const msgHex = ethUtil.bufferToHex(Buffer.from(msg));
  // const msgBuffer = ethUtil.toBuffer(msgHex);
  // const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
  // const signatureBuffer = ethUtil.toBuffer(signature);
  // const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
  // const publicKey = ethUtil.ecrecover(
  //   msgHash,
  //   signatureParams.v,
  //   signatureParams.r,
  //   signatureParams.s
  // );
  // const addresBuffer = ethUtil.publicToAddress(publicKey);
  // const address = ethUtil.bufferToHex(addresBuffer);
  const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });
  let token;
  console.log(user.wallet_address, address);
  if (address.toLowerCase() === user.wallet_address.toLowerCase()) {
    token = jwt.sign(
      {
        _id: user.user_id,
        address: user.nonce,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return token;
  } else {
    return false;
  }
};
exports.createCompany = async (req, res) => {
  try {
    const {
      company_name,
      company_description,
      company_size,
      company_links,
      phone,
      country_code,
      established_year,
      address1,
      wallet_address,
      address2,
    } = req.body;
    const User = await user.findOne({ where: { wallet_address } });
    if (!User) throw new Error("User not found");
    const token = await validateMetaLogin(User, User.signature);
    if (!token) throw new Error("Invalid signature");
    User.token = token;
    await User.save();
    if (req.file) {
      const file = req.file;
      const company_logo = `${file.filename}`;
      const user_id = User.user_id;
      const verify_status = false;
      const company_id = v1();
      const query = `
      INSERT INTO companies (
        company_id,company_name,company_description,company_size,phone,country_code,established_year,company_logo,
        address1,
        address2,user_id,verify_status,company_links
        ) VALUES (
          '${company_id}','${company_name}','${company_description}','${company_size}',${phone},${country_code},${established_year},'${company_logo}','${address1}','${address2}','${user_id}',${verify_status},'${company_links}'
          )
          RETURNING *;
          `;
      const [addCompany] = await sequelize.query(query);
      if (!addCompany.length) throw new Error("Company not created");
      else {
        uploadFile(file, addCompany[0])
          .then(() => console.log("successfully uploaded"))
          .catch((error) => console.log(error));
        await UpdateInfo(User.user_id);
        return res.json({
          success: true,
          message: "Company has been created successfully",
          token,
          company: addCompany,
        });
      }
    } else {
      const user_id = User.user_id;
      const verify_status = false;
      const company_id = v1();
      const query = `
      INSERT INTO companies (
        company_id,company_name,company_description,company_size,phone,country_code,established_year,company_logo,
        address1,
        address2,user_id,verify_status,company_links
        ) VALUES (
            '${company_id}','${company_name}','${company_description}','${company_size}',${phone},${country_code},${established_year},'${req.body.company_logo}','${address1}','${address2}','${user_id}',${verify_status},'${company_links}'
        )
        RETURNING *;
      `;
      const [addCompany] = await sequelize.query(query);
      if (!addCompany.length) throw new Error("Company not created");
      else {
        await UpdateInfo(User.user_id);
        return res.json({
          success: true,
          message: "Company has been created successfully",
          token,
          company: addCompany,
        });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
