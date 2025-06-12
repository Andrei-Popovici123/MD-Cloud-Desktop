// GET /file/:dataId/cdr

const { getReport } = require("../fileUpload/mdService");
const logger = require("../utils/logger");

exports.fetchCdrResults = async (req, res, next) => {
  try {
    const result = await getReport(req.params.dataId);
    res.json({ sanitized: result.sanitized, process_info: result.process_info });
  } catch (err) {
    logger.error(`Error fetching CDR results for dataId ${req.params.dataId}: ${err.message}`);
    next(err);
  }
};