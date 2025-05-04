const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/file/:dataId/multiscan", controller.fetchScanResults);

module.exports = router;