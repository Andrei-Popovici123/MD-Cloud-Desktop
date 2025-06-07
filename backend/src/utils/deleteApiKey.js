const keytar = require("keytar");
const logger = require("../utils/logger");

const SERVICE = "md-cloud-desktop";
const ACCOUNT = "OPSWAT_API_KEY";

async function main() {
  try {
    await keytar.deletePassword(SERVICE, ACCOUNT);
    logger.info("API key successfully deleted from keychain.");
    process.exit(0);
  } catch (err) {
    logger.error(`Failed to delete API key: ${err.message}`);
    process.exit(1);
  }
}

main();