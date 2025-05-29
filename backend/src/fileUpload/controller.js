// const { getReport, postFileStream } = require("./mdService");
// const { saveReport } = require("../models/Report");

// const { spawn } = require("child_process");
// const path = require("path");
// const fs = require('fs');

// // POST /upload
// exports.upload = async (req, res, next) => {
//   try {
//     if (req.file) {
//       const dataId = await postFileStream(req.file.buffer, req.file.originalName);
//       return res.json({ success: true, originalName: req.file.originalname, dataId });
//     }

//     if (req.body.folderPath) {
//       const receivedPath = req.body.folderPath;

//       if (!fs.existsSync(receivedPath)) {
//         return res.status(400).json({ error: "Path does not exist" });
//       }

//       let filename;
//       let py;

//       if (fs.statSync(receivedPath).isDirectory()) {
//         py = spawn("python", [path.join(__dirname, "../middleware/archive.py"), receivedPath]);
//         filename = path.basename(receivedPath) + ".zip";
//       }
//       else if (fs.statSync(receivedPath).isFile()) {
//         py = spawn("python", [path.join(__dirname, "../middleware/archive.py"), receivedPath]);
//         filename = path.basename(receivedPath);
//       }
//       else {
//         return res.status(400).json({ error: "Not a file or folder" });
//       }

//       const dataId = await postFileStream(py.stdout, filename);

//       return res.json({ success: true, originalName: filename, dataId });
//     }

//     return res.status(400).json({ error: "No file or folderPath provided" });
//   } catch (err) {
//     next(err);
//   }
// };

// // GET /file/dataId
// exports.fetchFullReport = async (req, res, next) => {
//   try {
//     const { dataId } = req.params;
//     const report = await getReport(dataId);

//     await saveReport(report);

//     res.json(report);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     next(err);
//   }
// };
const { getReport, postFileStream } = require("./mdService");
const { saveReport } = require("../models/Report");

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// POST /upload
exports.upload = async (req, res, next) => {
  try {
    if (req.file) {
      const dataId = await postFileStream(
        req.file.buffer,
        req.file.originalname
      );

      return res.json({
        success: true,
        originalName: req.file.originalname,
        dataId,
      });
    }

    if (req.body.folderPath) {
      const receivedPath = req.body.folderPath;

      if (!fs.existsSync(receivedPath)) {
        return res.status(400).json({ error: "Path does not exist" });
      }

      let filename;
      let py;

      if (fs.statSync(receivedPath).isDirectory()) {
        py = spawn("python", [
          path.join(__dirname, "../middleware/archive.py"),
          receivedPath,
        ]);
        filename = path.basename(receivedPath) + ".zip";
      } else if (fs.statSync(receivedPath).isFile()) {
        py = spawn("python", [
          path.join(__dirname, "../middleware/archive.py"),
          receivedPath,
        ]);
        filename = path.basename(receivedPath);
      } else {
        return res.status(400).json({ error: "Not a file or folder" });
      }

      const dataId = await postFileStream(py.stdout, filename);

      return res.json({ success: true, originalName: filename, dataId });
    }

    return res.status(400).json({ error: "No file or folderPath provided" });
  } catch (err) {
    next(err);
  }
};

// GET /file/:dataId
exports.fetchFullReport = async (req, res, next) => {
  try {
    const { dataId } = req.params;
    const report = await getReport(dataId);

    await saveReport(report);

    res.json(report);
  } catch (err) {
    console.error(err.response?.data || err.message);
    next(err);
  }
};

// GET /file/:dataId/zip-entries
exports.getZipEntries = async (req, res, next) => {
  try {
    const { dataId } = req.params;
    const report = await getReport(dataId);
    const files = report.extracted_files?.files_in_archive || [];

    const entries = files.map((f) => ({
      name: f.display_name,
      size: f.file_size,
      compressedSize: 0,
      dataId: f.data_id,
    }));

    return res.json({ filename: `${dataId}.zip`, entries });
  } catch (err) {
    console.error("Failed to load extracted file list:", err);
    res.status(500).json({ error: "Failed to load extracted file list" });
  }
};
