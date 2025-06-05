// GET /file/dataId/dlp

const { getReport } = require("../fileUpload/mdService");
const logger = require("../utils/logger");

exports.fetchDlpResults = async (req, res, next) => {
  try {
    const result = await getReport(req.params.dataId);
    res.json({ dlp_info: result.dlp_info });
  } catch (err) {
    logger.error(`Error fetching DLP results for dataId ${req.params.dataId}: ${err.message}`);
    next(err);
  }
};