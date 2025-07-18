const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");
const logger = require("../utils/logger");

async function openDb() {
  const dbPath = path.resolve(__dirname, "../../database.sqlite");

  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}


async function run(sql, params = []) {
  const db = await openDb();
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    logger.error(`Error running SQL: ${sql} - ${err.message}`);
  } finally {
    await db.close();
  }
}

async function get(sql, params = []) {
  const db = await openDb();
  try {
    const row = await db.get(sql, params);
    return row;
  } catch (err) {
    logger.error(`Error running SQL: ${sql} - ${err.message}`);
  } finally {
    await db.close();
  }
}

(async () => {
  try {
    const db = await openDb();
    await db.run(`CREATE TABLE IF NOT EXISTS reports (data_id TEXT PRIMARY KEY, report TEXT NOT NULL, fetchedAt INTEGER NOT NULL)`);
  } catch (err) {
    logger.error(`Error creating table: ${err.message}`);
  }
})();

module.exports = { run, get };