const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/file/:dataId/dlp", controller.fetchDlpResults);

module.exports = router;