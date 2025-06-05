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
const logger = require("../utils/logger");

// POST /upload
exports.upload = async (req, res, next) => {
  try {
    logger.info("Received upload request");
    if (req.file) {
      logger.info(`Uploading single file: ${ req.file.originalname}`);
      const dataId = await postFileStream(
        req.file.buffer,
        req.file.originalname
      );
      logger.info(`Uploaded single file to Metadefender, dataId: ${dataId}`);

      return res.json({
        success: true,
        originalName: req.file.originalname,
        dataId,
      });
    }

    if (req.body.folderPath) {
      const receivedPath = req.body.folderPath;
      logger.info("Received path: %s", receivedPath);

      if (!fs.existsSync(receivedPath)) {
        logger.warn("Path does not exist: %s", receivedPath);
        return res.status(400).json({ error: "Path does not exist" });
      }

      let filename;
      let py;

      if (fs.statSync(receivedPath).isDirectory()) {
        logger.info(`Archiving folder: ${receivedPath}`);
        py = spawn("python", [
          path.join(__dirname, "../middleware/archive.py"),
          receivedPath,
        ]);
        filename = path.basename(receivedPath) + ".zip";

      } else if (fs.statSync(receivedPath).isFile()) {
        logger.info(`Streaming file from path: ${receivedPath}`);
        py = spawn("python", [
          path.join(__dirname, "../middleware/archive.py"),
          receivedPath,
        ]);
        filename = path.basename(receivedPath);

      } else {
        logger.warn(`Invalid file type, it isn't a file or a folder: ${receivedPath}`);
        return res.status(400).json({ error: "Not a file or folder" });
      }

      const dataId = await postFileStream(py.stdout, filename);
      logger.info(`Uploaded from path to Metadefender, dataId: ${dataId}`);

      return res.json({ success: true, originalName: filename, dataId });
    }

    logger.warn("No file or folderPath provided provided");
    return res.status(400).json({ error: "No file or folderPath provided" });
  } catch (err) {
    logger.error(`Error during upload: ${err.message}`);
    next(err);
  }
};

// GET /file/:dataId
exports.fetchFullReport = async (req, res, next) => {
  try {
    const { dataId } = req.params;
    logger.info(`Fetching full report with dataId: ${dataId}`);
    const report = await getReport(dataId);

    await saveReport(report);
    logger.info(`Report saved to db with dataId: ${dataId}`);

    res.json(report);
  } catch (err) {
    //console.error(err.response?.data || err.message);
    logger.error(`Error fetching full report for dataId ${dataId}: ${err.message}`);
    next(err);
  }
};


// GET /file/:dataId/zip-entries
exports.getZipEntries = async (req, res, next) => {
  try {
    const { dataId } = req.params;
    logger.info(`Getting zip entries for dataId: ${dataId}`);

    const report = await getReport(dataId);
    const files = report.extracted_files?.files_in_archive || [];

    const entries = files.map((f) => ({
      name: f.display_name,
      size: f.file_size,
      compressedSize: 0,
      dataId: f.data_id,
    }));

    logger.info(`Returning ${entries.length} zip entries for dataId ${dataId}`);
    return res.json({ filename: `${dataId}.zip`, entries });
  } catch (err) {
    logger.error(`Failed to load extracted file list for dataid ${dataId}: ${err.message}`);
    res.status(500).json({ error: "Failed to load extracted file list" });
  }
};
