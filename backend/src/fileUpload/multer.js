const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const uploadFolder = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    const hash = crypto
      .createHash("sha256")
      .update(
        file.originalname + Date.now().toString() + crypto.randomBytes(16)
      )
      .digest("hex");

    cb(null, `${hash}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});


module.exports = upload;