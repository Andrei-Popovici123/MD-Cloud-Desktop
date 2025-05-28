import React from "react";

interface StatusBadgeProps {
  verdict: string;
  unsupported?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  verdict,
  unsupported = false,
  className = "",
}) => {
  const bgClass = unsupported ? "bg-gray-600" : "bg-rgb(0, 138, 0)";
  const text = unsupported ? "Unsupported File Type" : verdict;

  return (
    <span
      className={`
          ${bgClass} text-white text-sm font-medium
          px-3 py-1 rounded
          whitespace-nowrap
          ${className}             
        `}
    >
      {text}
    </span>
  );
};
