import React from "react";
import classNames from "classnames";

export interface StatusBadgeProps {
  verdictCode: number;
  unsupported?: boolean;
}

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
  const verdictText = unsupported
    ? "Unsupported File Type"
    : VERDICT_MAP[verdictCode] || "Unknown";

  const badgeClass = classNames(
    "inline-block px-2 py-1 text-xs font-semibold text-white",
    {
      "bg-red-700": verdictCode === 1,
      "bg-yellow-600": verdictCode === 2,
      "bg-gray-600": verdictCode > 2 && !unsupported,
      "bg-indigo-600": unsupported,
    }
  );

  const badgeStyle =
    verdictCode === 0 && !unsupported
      ? { backgroundColor: "rgb(0, 138, 0)" }
      : undefined;

  return (
    <span className={badgeClass} style={badgeStyle}>
      {verdictText}
    </span>
  );
};
