// GET /file/dataId/multiscan

const { getReport } = require("../fileUpload/mdService");

exports.fetchScanResults = async (req, res, next) => {
  try {
    const result = await getReport(req.params.dataId);
    res.json({ scan_results: result.scan_results });
  } catch (err) {
    next(err);
  }
};