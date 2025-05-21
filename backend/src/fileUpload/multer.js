const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const uploadFolder = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});


module.exports = upload;