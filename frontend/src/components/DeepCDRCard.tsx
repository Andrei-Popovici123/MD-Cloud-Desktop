// import React, { useEffect, useState } from "react";
// import SectionCard from "./SectionCard";
// import { ExternalLink } from "lucide-react";
// import illustration from "../assets/deepcdr-illustration.png";
// import { fetchDeepCdr } from "../services/api";

// export type Variant = "success" | "warning" | "danger";

// export interface DeepCDRCardProps {
//   dataId?: string;
//   onStatusChange: (text: string, variant: Variant) => void;
// }

// interface CdrRow {
//   object: string;
//   action: string;
// }

// interface DeepCdrResponse {
//   sanitized?: {
//     result?: string;
//     file_path?: string;
//     progress_percentage?: number;
//     reason?: string;
//   };
//   process_info?: {
//     progress_percentage?: number;
//     verdicts?: string[];
//     post_processing?: any;
//   };
// }

// export const DeepCDRCard: React.FC<DeepCDRCardProps> = ({
//   dataId,
//   onStatusChange,
// }) => {
//   const [rows, setRows] = useState<CdrRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [downloadLink, setDownloadLink] = useState<string>("");
//   const [progress, setProgress] = useState<number>(0);
//   const [hasSensitive, setHasSensitive] = useState<boolean>(false);
//   const [sanitizedResult, setSanitizedResult] = useState<string>("");
//   const [sanitizedReason, setSanitizedReason] = useState<string>("");

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     setRows([]);
//     setDownloadLink("");
//     setProgress(0);
//     setHasSensitive(false);
//     setSanitizedResult("");
//     setSanitizedReason("");

//     if (!dataId) {
//       setError("Data ID is unavailable. Awaiting upload completion.");
//       setLoading(false);
//       return;
//     }

//     fetchDeepCdr(dataId)
//       .then((response) => {
//         const { sanitized, process_info }: DeepCdrResponse = response.data;

//         // Guard against undefined sanitized or missing fields
//         if (sanitized && typeof sanitized.result !== "undefined") {
//           setSanitizedResult(sanitized.result);
//           setSanitizedReason(sanitized.reason || "");
//           setProgress(sanitized.progress_percentage || 0);
//           setDownloadLink(sanitized.file_path || "");
//         } else {
//           setSanitizedResult("");
//           setSanitizedReason("");
//         }

//         const verdicts = process_info?.verdicts || [];
//         const sensitiveFound =
//           verdicts.includes("Sensitive Data Found") ||
//           sanitized?.reason === "Sensitive Data Found";
//         setHasSensitive(sensitiveFound);

//         const details =
//           process_info?.post_processing?.sanitization_details?.details;
//         if (Array.isArray(details) && details.length > 0) {
//           setRows(
//             details.map((d: any) => ({
//               object: d.object_name || "Unknown Object",
//               action: d.action || "Processed",
//             }))
//           );
//         } else {
//           const defaultObjects = [
//             "Custom XML",
//             "External Image",
//             "Hyperlink",
//             "Image",
//           ];
//           setRows(
//             defaultObjects.map((obj) => ({
//               object: obj,
//               action: "Not Present",
//             }))
//           );
//         }
//       })
//       .catch((err: any) => {
//         console.error(err);
//         const message =
//           err.response?.data?.message ||
//           err.message ||
//           "Failed to load sanitization data";
//         setError(message);
//       })
//       .finally(() => setLoading(false));
//   }, [dataId]);

//   const badgeText = loading
//     ? "Sanitization In Progress"
//     : error
//     ? "Error"
//     : sanitizedResult === "Error"
//     ? sanitizedReason || "Error"
//     : hasSensitive
//     ? "Sensitive Data Found"
//     : progress === 100
//     ? "Sanitization Complete"
//     : "Sanitization Available";

//   const badgeVariant: Variant = loading
//     ? "warning"
//     : error
//     ? "danger"
//     : sanitizedResult === "Error"
//     ? "danger"
//     : hasSensitive
//     ? "danger"
//     : progress === 100
//     ? "success"
//     : "warning";

//   useEffect(() => {
//     onStatusChange(badgeText, badgeVariant);
//   }, [badgeText, badgeVariant, onStatusChange]);

//   const disableDownload =
//     loading || !!error || sanitizedResult === "Error" || hasSensitive;

//   return (
//     <SectionCard
//       id="deep-cdr-card"
//       title="Deep CDR™ Regeneration"
//       infoTooltip="Files are sanitized by removing unsupported objects and regenerating safe formats."
//       badgeText={badgeText}
//       badgeVariant={badgeVariant}
//     >
//       <div className="relative overflow-hidden">
//         {!loading && !error && (
//           <div className="absolute top-0 right-6 flex items-center space-x-2">
//             {disableDownload ? (
//               <button
//                 disabled
//                 className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg cursor-not-allowed"
//               >
//                 Download Sanitized Version
//               </button>
//             ) : (
//               <a href={downloadLink} target="_blank" rel="noopener noreferrer">
//                 <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-300 hover:from-blue-600 hover:to-blue-400 text-white text-sm font-medium rounded-lg">
//                   Download Sanitized Version
//                 </button>
//               </a>
//             )}
//             <ExternalLink className="w-5 h-5 text-gray-400 hover:text-white" />
//           </div>
//         )}

//         <h5 className="text-gray-300 text-sm mb-5">After Data Sanitization</h5>

//         <div className="flex items-center">
//           <div className="flex-1 overflow-auto pr-8">
//             <table className="w-full text-left text-gray-200 text-sm">
//               <thead>
//                 <tr>
//                   <th className="pb-2">Object</th>
//                   <th className="pb-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows.map((row) => (
//                   <tr key={row.object} className="border-t border-gray-700">
//                     <td className="py-3">{row.object}</td>
//                     <td className="py-3">
//                       <span className="inline-block px-2 py-1 text-xs text-white bg-gray-600 rounded">
//                         {row.action}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex-shrink-0 flex items-center justify-center">
//             <img
//               src={illustration}
//               alt="Document sanitization illustration"
//               className="w-48 h-48 opacity-20"
//             />
//           </div>
//         </div>
//       </div>
//     </SectionCard>
//   );
// };

// export default DeepCDRCard;
import React, { useEffect, useState } from "react";
import SectionCard from "./SectionCard";
import { ExternalLink } from "lucide-react";
import illustration from "../assets/deepcdr-illustration.png";
import { fetchDeepCdr } from "../services/api";

export type Variant = "success" | "warning" | "danger";

export interface DeepCDRCardProps {
  dataId?: string;
  /**
   * Callback called when badge status changes
   * @param text - badge text (e.g. "Sensitive Data Found")
   * @param variant - "success" | "warning" | "danger"
   */
  onStatusChange: (text: string, variant: Variant) => void;
}

interface CdrRow {
  object: string;
  action: string;
}

interface DeepCdrResponse {
  sanitized: {
    result: string;
    file_path: string;
    progress_percentage: number;
    reason?: string;
  };
  process_info: {
    progress_percentage: number;
    verdicts?: string[];
    post_processing?: any;
  };
}

export const DeepCDRCard: React.FC<DeepCDRCardProps> = ({
  dataId,
  onStatusChange,
}) => {
  const [rows, setRows] = useState<CdrRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [hasSensitive, setHasSensitive] = useState<boolean>(false);
  const [sanitizedResult, setSanitizedResult] = useState<string>("");
  const [sanitizedReason, setSanitizedReason] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    setRows([]);
    setDownloadLink("");
    setProgress(0);
    setHasSensitive(false);
    setSanitizedResult("");
    setSanitizedReason("");

    if (!dataId) {
      setError("Data ID is unavailable. Awaiting upload completion.");
      setLoading(false);
      return;
    }

    fetchDeepCdr(dataId)
      .then((response) => {
        const { sanitized, process_info }: DeepCdrResponse = response.data;
        // store sanitized result and reason
        setSanitizedResult(sanitized.result);
        setSanitizedReason(sanitized.reason || "");

        const verdicts = process_info.verdicts || [];
        // Determine if any sensitive data was found
        const sensitiveFound =
          verdicts.includes("Sensitive Data Found") ||
          sanitized.reason === "Sensitive Data Found";
        setHasSensitive(sensitiveFound);

        setProgress(sanitized.progress_percentage);
        setDownloadLink(sanitized.file_path);

        const details =
          process_info.post_processing?.sanitization_details?.details;
        if (Array.isArray(details) && details.length > 0) {
          setRows(
            details.map((d: any) => ({
              object: d.object_name || "Unknown Object",
              action: d.action || "Processed",
            }))
          );
        } else {
          const defaultObjects = [
            "Custom XML",
            "External Image",
            "Hyperlink",
            "Image",
          ];
          setRows(
            defaultObjects.map((obj) => ({
              object: obj,
              action: "Not Present",
            }))
          );
        }
      })
      .catch((err: any) => {
        console.error(err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load sanitization data";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [dataId]);

  // Badge logic: prioritize sanitized errors, then sensitive, then completion/availability
  const badgeText = loading
    ? "Sanitization In Progress"
    : error
    ? "Error"
    : sanitizedResult === "Error"
    ? sanitizedReason || "Error"
    : hasSensitive
    ? "Sensitive Data Found"
    : progress === 100
    ? "Sanitization Complete"
    : "Sanitization Available";

  const badgeVariant: Variant = loading
    ? "warning"
    : error
    ? "danger"
    : sanitizedResult === "Error"
    ? "danger"
    : hasSensitive
    ? "danger"
    : progress === 100
    ? "success"
    : "warning";

  useEffect(() => {
    onStatusChange(badgeText, badgeVariant);
  }, [badgeText, badgeVariant, onStatusChange]);

  // disable button if sanitized error or sensitive data found
  const disableDownload =
    loading || !!error || sanitizedResult === "Error" || hasSensitive;

  return (
    <SectionCard
      id="deep-cdr-card"
      title="Deep CDR™ Regeneration"
      infoTooltip="Files are sanitized by removing unsupported objects and regenerating safe formats."
      badgeText={badgeText}
      badgeVariant={badgeVariant}
    >
      <div className="relative overflow-hidden">
        {!loading && !error && (
          <div className="absolute top-0 right-6 flex items-center space-x-2">
            {disableDownload ? (
              <button
                disabled
                className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg cursor-not-allowed"
              >
                Download Sanitized Version
              </button>
            ) : (
              <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-300 hover:from-blue-600 hover:to-blue-400 text-white text-sm font-medium rounded-lg">
                  Download Sanitized Version
                </button>
              </a>
            )}
            <ExternalLink className="w-5 h-5 text-gray-400 hover:text-white" />
          </div>
        )}

        <h5 className="text-gray-300 text-sm mb-5">After Data Sanitization</h5>

        <div className="flex items-center">
          <div className="flex-1 overflow-auto pr-8">
            <table className="w-full text-left text-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="pb-2">Object</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.object} className="border-t border-gray-700">
                    <td className="py-3">{row.object}</td>
                    <td className="py-3">
                      <span className="inline-block px-2 py-1 text-xs text-white bg-gray-600 rounded">
                        {row.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center">
            <img
              src={illustration}
              alt="Document sanitization illustration"
              className="w-48 h-48 opacity-20"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default DeepCDRCard;
