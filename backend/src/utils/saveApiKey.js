const keytar = require("keytar");
const logger = require("../utils/logger");

const SERVICE = "md-cloud-desktop";
const ACCOUNT = "OPSWAT_API_KEY";

async function main() {
  const apiKey = process.argv[2];
  if (!apiKey) {
    logger.warn("Usage: node saveApiKey.js <API_KEY>");
    process.exit(1);
  }

  try {
    await keytar.setPassword(SERVICE, ACCOUNT, apiKey);
    logger.info("API key stored successfully in keychain.");
    process.exit(0);
  } catch (err) {
    logger.error(`Failed to store API key: ${err.message}`);
    process.exit(1);
  }
}

main();