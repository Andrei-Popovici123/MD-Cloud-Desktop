const express = require('express')
const cors = require('cors');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const uploadFolder = './uploads/';

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })


app.post('/upload', upload.single('file'), function (req, res) {
  return res.json({ success: true, originalName: req.file.originalname});
});


app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});