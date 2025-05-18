// const { Schema, model } = require('mongoose');

// const scanDetailSchema = new Schema({
//   scan_time: Number,
//   def_time: Date,
//   scan_result_i: Number,
//   threat_found: String
// }, { _id: false });

// const scanResultsSchema = new Schema({
//   scan_details: {
//     type: Map,
//     of: scanDetailSchema
//   },
//   scan_all_result_i: Number,
//   current_av_result_i: Number,
//   start_time: Date,
//   total_time: Number,
//   total_avs: Number,
//   total_detected_avs: Number,
//   progress_percentage: Number,
//   scan_all_result_a: String,
//   current_av_result_a: String
// }, { _id: false });

// const extractedFiles_filesInArchive = new Schema({
//   display_name: String,
//   data_id: String,
//   scan_result_i: Number,
//   progress_percentage: Number,
//   file_size: Number,
//   file_type: String,
//   detected_by: Number
// }, { _id: false });

// const ruleHitSchema = new Schema({
//   before: String,
//   after: String,
//   hit: String,
//   location: String,
//   certainty: {
//     type: String,
//     enum: ["Very Low","Low","Medium","High","Very High"]
//    },
//   certainty_score: Number,
//   tryRedact: Boolean
// }, { _id: false });

// const ruleSchema = new Schema({
//   display_name: String,
//   hits: [ruleHitSchema],
//   metadata_removal:{
//     result: String
//   },
//   redact: {
//     result: String
//   },
//   verdict: Number,
//   watermark: {
//     result: String
//   }
// }, { _id: false });

// const dlp_info = new Schema({
//   filename: String,
//   result_template_hash: String,
//   verdict: Number,

//   anonymization: {
//     result: String
//   },
//   crop_embedded_images: {
//     result: String
//   },
//   detection_policy: {
//     result: String
//   },
//   document_identification:{
//     result: String
//   },
//   intentional_data_leak: {
//     result: String
//   },
//   metadata_removal: {
//     result: String
//   },
//   recursive_processing: {
//     result: String
//   },
//   redact: {
//     result: String
//   },
//   watermark: {
//     result: String
//   },

//   scan: {
//     result: String,
//     types: {
//       ai:    {
//         display_name: String,
//         result: String
//       },
//       regex: {
//         display_name: String,
//         result: String
//       }
//     }
//   },

//   errors: Schema.Types.Mixed,

//   hits: {
//     type: Map,
//     of: ruleSchema
//   }

// }, { _id: false });

// const reportSchema = new Schema({
//   file_id: String,
//   data_id: String,

//   sanitized: {
//     result: String,
//     reason: String,
//     progress_percentage: Number,
//     data_id: String,
//     file_path: String,
//     failure_reasons: {
//       display_name: String,
//       file_path: String,
//       reason: String,
//       details: String
//     }
//   },

//   process_info: {
//     progress_percentage: Number,
//     blocked_reasons: [String],
//     result: String,
//     post_processing: {
//       actions_failed: String,
//       actions_ran: String,
//       converted_destination: String,
//       converted_to: String,
//       copy_move_destination: String
//     },
//     verdicts: [String],
//     profile: String,
//     blocked_reason: String,
//     sanitization_details: {
//       description: String,
//       details: {
//         action: String,
//         count: Number,
//         failure_category: String,
//         description: String,
//         file_name: String,
//         object_details: String,
//         object_name: String,
//       },
//       sanitized_file_info: {
//         file_size: Number,
//         sha256: String
//       }
//     }
//   },


//   extracted_files: {
//     files_in_archive: [extractedFiles_filesInArchive]
//   },


//   scan_results: scanResultsSchema,

//   file_info: {
//     file_size: Number,
//     upload_timestamp: Date,
//     md5: String,
//     sha1: String,
//     sha256: String,
//     file_type_category: String,
//     file_type_description:String,
//     file_type_extension: String,
//     display_name: String,
//     metadata: Schema.Types.Mixed // maybe to be changed later
//   },

//   share_file: Number,
//   private_processing: Number,
//   rest_version: String,

//   dlp_info: dlp_info,

//   additional_info: [Schema.Types.Mixed],

//   votes: {
//     up: Number,
//     down: Number
//   },
  
//   stored: Boolean,
// });

// module.exports = model('Report', reportSchema);

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