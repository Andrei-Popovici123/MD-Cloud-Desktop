const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");

// const base_url = "https://api-qa.metadefender.com/v4"; // This is the test URL for the MetaDefender API
const base_url = "https://api.metadefender.com/v4";
const apikey = process.env.OPSWAT_API_KEY;

async function postFile(filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const resp = await axios.post(`${base_url}/file`, form, {
    headers: {
      apikey: apikey,
      rule: "unarchive,sanitize,dlp",
      filename: path.basename(filePath),
    },
  });
  return resp.data.data_id;
}

async function postFileStream(stream, filename) {
  const form = new FormData();
  form.append("file", stream, { filename });
  const resp = await axios.post(
    `${base_url}/file`,
    //`${base_url_after_8}/file`,
    form,
    { headers: {
        apikey: apikey,
        //apikey: apikey_after_8,
        rule: "unarchive,sanitize,dlp",
        filename: filename
      }}
  );
  return resp.data.data_id;
}

async function getReport(dataId) {
  const resp = await axios.get(`${base_url}/file/${dataId}`, {
    headers: { apikey: apikey },
  });
  return resp.data;
}

module.exports = { postFile, postFileStream, getReport };
