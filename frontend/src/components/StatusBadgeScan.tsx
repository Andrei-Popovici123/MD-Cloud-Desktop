import React from "react";
import classNames from "classnames";

export interface StatusBadgeProps {
  // Numeric scan result code returned by OPSWAT
  verdictCode: number;
  // If true, engine does not support this file type
  unsupported?: boolean;
}

// Mapping of scan_result_i codes to human-readable verdicts
const VERDICT_MAP: Record<number, string> = {
  0: "No Threats Found",
  1: "Infected/Known",
  2: "Suspicious",
  3: "Failed To Scan",
  4: "Cleaned / Deleted",
  5: "Unknown",
  6: "Quarantined",
  7: "Skipped Clean",
  8: "Skipped Infected",
  9: "Exceeded Archive Depth",
  10: "Not Scanned / No scan results",
  11: "Aborted",
  12: "Encrypted",
  13: "Exceeded Archive Size",
  14: "Exceeded Archive File Number",
  15: "Password Protected Document",
  16: "Exceeded Archive Timeout",

  18: "Unsupported File Type",
  23: "Unsupported File Type",
};

export const StatusBadgeScan: React.FC<StatusBadgeProps> = ({
  verdictCode,
  unsupported,
}) => {
  // Determine the text to show
  const verdictText = unsupported
    ? "Unsupported File Type"
    : VERDICT_MAP[verdictCode] || "Unknown";

  // Determine badge color based on verdict category
  const badgeClass = classNames(
    "inline-block px-2 py-1  text-xs font-semibold",
    {
      "bg-green-600 text-white": verdictCode === 0 && !unsupported,
      "bg-red-600 text-white": verdictCode === 1,
      "bg-yellow-600 text-white": verdictCode === 2,
      "bg-gray-600 text-white": verdictCode > 2 && !unsupported,
      "bg-indigo-600 text-white": unsupported,
    }
  );

  return <span className={badgeClass}>{verdictText}</span>;
};
