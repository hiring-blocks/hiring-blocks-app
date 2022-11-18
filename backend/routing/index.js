const express = require('express');

const adminRouting = require('./admin.routing');
const google_sheetRouting = require('./google_sheet.routing');



const router = express.Router();

router.use('/admin', adminRouting);
router.use('/google_sheet', google_sheetRouting);



module.exports = router;
