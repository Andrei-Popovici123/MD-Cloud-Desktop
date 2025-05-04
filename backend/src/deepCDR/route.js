const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/file/:dataId/cdr", controller.fetchCdrResults);

module.exports = router;