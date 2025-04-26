import React from "react";

export interface DLPItemCardProps {
  id: string;
  label: string;
  count: number;
  icon?: React.ReactNode;
}

export const DLPItemCard: React.FC<DLPItemCardProps> = ({
  label,
  count,
  icon,
}) => (
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
    <span className="text-gray-400 font-medium">{count}</span>
  </div>
);
