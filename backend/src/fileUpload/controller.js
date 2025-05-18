const { postFile, getReport } = require("./mdService");
// const Report = require("../models/Report");
const { saveReport } = require("../models/Report");

const { exec } = require("child_process");
const path = require("path");
const fs = require('fs');

// // POST /upload
// exports.upload = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file received" });
//     }

//     const dataId = await postFile(req.file.path);
//     res.json({
//       success: true,
//       originalName: req.file.originalname,
//       dataId
//     });
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     next(err);
//   }
// };

// POST /upload
exports.upload = async (req, res, next) => {
    try {
        if (req.file) {

            const dataId = await postFile(req.file.path);

            res.json({
                success: true,
                originalName: req.file.originalname,
                dataId
            });

        } else if (req.body.folderPath) {

            const folderPath = req.body.folderPath;
            const uploadFolder = path.resolve(__dirname, "../../uploads");
            

            if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
                return res.status(400).json({ error: "Invalid folder path" });
            }

            exec(`python ${path.join(__dirname, '../middleware/archive.py')} "${folderPath}" "${uploadFolder}"`,
                async (error, stdout) => {
                  if (error) {
                    return res.status(500).json({ error: "Folder archiving failed" });
                  }

                    const archivePath = stdout.trim();

                    const archiveToBeSent = {
                        path: archivePath,
                        originalname: path.basename(archivePath),
                    };
                    req.file = archiveToBeSent;

                    try {
                        const dataId = await postFile(req.file.path);
                        res.json({
                            success: true,
                            originalName: req.file.originalname,
                            dataId
                        });
                    } catch (err) {
                        console.error(err.response?.data || err.message);
                        next(err);
                    }
                });
        } else {
            return res.status(400).json({ error: "No file or folder path provided" });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET /file/dataId
exports.fetchFullReport = async (req, res, next) => {
  try {
    const { dataId } = req.params;
    const report = await getReport(dataId);

    // await Report.findOneAndUpdate(
    //   { data_id: report.data_id },
    //   {
    //     ...report,
    //     fetchedAt: new Date()
    //   },
    //   {
    //     upsert: true,
    //     new: true
    //   }
    // );
    await saveReport(report);

    res.json(report);
  } catch (err) {
    console.error(err.response?.data || err.message);
    next(err);
  }
};
