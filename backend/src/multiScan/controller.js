// GET /file/dataId/multiscan

const { getReport } = require("../fileUpload/mdService");
const logger = require("../utils/logger");

exports.fetchScanResults = async (req, res, next) => {
  try {
    const result = await getReport(req.params.dataId);
    res.json({ scan_results: result.scan_results });
  } catch (err) {
    logger.error(`Error fetching scan results for dataId ${req.params.dataId}: ${err.message}`);
    next(err);
  }
};