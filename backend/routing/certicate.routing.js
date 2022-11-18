const express = require("express");
const router = express.Router();
const {
  ClaimCertificate,
} = require("../controllers/cerificate/getCertificate");

router.get("/claim/certificate", ClaimCertificate);

module.exports = router;
