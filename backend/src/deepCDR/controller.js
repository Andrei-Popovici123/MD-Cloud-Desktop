// GET /file/dataId/cdr

const { getReport } = require("../fileUpload/mdService");

exports.fetchCdrResults = async (req, res, next) => {
  try {
    const result = await getReport(req.params.dataId);
    res.json({ sanitized: result.sanitized, process_info: result.process_info });
  } catch (err) {
    next(err);
  }
};