import React from "react";

export interface DLPItemCardProps {
  id: string;
  label: string;
  count: number;
  icon?: React.ReactNode;

  severity?: number;
}

export const DLPItemCard: React.FC<DLPItemCardProps> = ({
  label,
  count,
  icon,
  severity = 0,
}) => {
  // Mapping severitate → clasa de background & text
  const badgeClass =
    severity >= 2
      ? "bg-red-600 text-white"
      : severity === 1
      ? "bg-yellow-600 text-white"
      : "bg-gray-600 text-gray-200";

  return (
    <div
      className="
        bg-gray-700 rounded-md p-4
        flex items-center justify-between
        hover:bg-gray-600 transition
      "
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-white text-sm">{label}</span>
      </div>
      <span className={`px-2 py-1 rounded ${badgeClass} font-medium`}>
        {count}
      </span>
    </div>
  );
};
