const { postFile, getReport } = require("./mdService");

// POST /upload
exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

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
};

// GET /file/dataId
exports.fetchFullReport = async (req, res, next) => {
  try {
    const { dataId } = req.params;
    const report = await getReport(dataId);
    res.json(report);
  } catch (err) {
    console.error(err.response?.data || err.message);
    next(err);
  }
};
