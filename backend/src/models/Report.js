const { run, get } = require("../db/db");
const logger = require("../utils/logger");

async function saveReport(report) {
  try {
    logger.info(`Saving report for data_id: ${report.data_id}`);
    await run(`INSERT OR REPLACE INTO reports (data_id, report, fetchedAt) VALUES (?, ?, ?);`,[report.data_id, JSON.stringify(report), Date.now()]);
  } catch (err) {
    logger.error(`Error saving report: ${err.message}`);
  }
}

async function fetchReport(dataId) {
  try {
    logger.info(`Fetching report for data_id: ${dataId}`);
    const row = await get(`SELECT report FROM reports WHERE data_id = ?;`,[dataId]);
    if (row) {
      const parsedReport = JSON.parse(row.report);
      return parsedReport;
    } else {
      logger.warn(`No report found for data_id: ${dataId}`);
      return null;
    }
  } catch (err) {
    logger.error(`Error fetching report: ${err.message}`);
  }
}

module.exports = { saveReport, fetchReport };