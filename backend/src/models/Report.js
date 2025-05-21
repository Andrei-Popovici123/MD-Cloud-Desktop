const { run, get } = require("../db/db");

async function saveReport(report) {
  try {
    await run(`INSERT OR REPLACE INTO reports (data_id, report, fetchedAt) VALUES (?, ?, ?);`,[report.data_id, JSON.stringify(report), Date.now()]);
  } catch (err) {
    console.error("Error saving report:", err);
  }
}

async function fetchReport(dataId) {
  try {
    const row = await get(`SELECT report FROM reports WHERE data_id = ?;`,[dataId]);
    if (row) {
      const parsedReport = JSON.parse(row.report);
      return parsedReport;
    } else {
      console.log(`No report found for data_id: ${dataId}`);
      return null;
    }
  } catch (err) {
    console.error("Error fetching report:", err);
  }
}

module.exports = { saveReport, fetchReport };