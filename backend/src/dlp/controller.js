// GET /file/dataId/dlp

const { getReport } = require("../fileUpload/mdService");

exports.fetchDlpResults = async (req, res, next) => {
  try {
    const result = await getReport(req.params.dataId);
    res.json({ dlp_info: result.dlp_info });
  } catch (err) {
    next(err);
  }
};