const express = require("express");
const controller = require("./controller");
const upload = require("./multer");

const router = express.Router();

router.post("/upload", upload.single("file"), controller.upload);
router.get("/file/:dataId", controller.fetchFullReport);
router.get("/file/:dataId/zip-entries", controller.getZipEntries);

module.exports = router;
