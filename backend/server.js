const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const uploadFolder = "./uploads/";

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    const hash = crypto
      .createHash("sha256")
      .update(
        file.originalname + Date.now().toString() + crypto.randomBytes(16)
      )
      .digest("hex");

    //const hash = crypto.randomUUID();
    cb(null, `${hash}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

app.post("/upload", upload.single("file"), function (req, res) {
  console.log(req.headers);
  if (!req.file) return res.statusCode(400).json({ error: "Upload failed" });
  return res.json({ success: true, originalName: req.file.originalname });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
