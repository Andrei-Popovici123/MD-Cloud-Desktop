import React from "react";

export interface DLPItemCardProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  severity: number;
}

export const DLPItemCard: React.FC<DLPItemCardProps> = ({
  label,
  icon,
  count,
  severity,
}) => {
  const countBg =
    severity >= 2
      ? "bg-red-600"
      : severity === 1
      ? "bg-yellow-500"
      : "bg-gray-700";

  return (
    <div className="relative bg-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-white">{label}</span>
      </div>
      <span
        className={`${countBg} text-white text-sm font-bold px-2 py-1 rounded absolute top-2 right-2`}
      >
        {count}
      </span>
    </div>
  );
};

export default DLPItemCard;
