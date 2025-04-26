// components/SectionCard.tsx
import React from "react";
import { StatusBadge } from "./StatusBadge";
import { Info } from "lucide-react";

interface SectionCardProps {
  title: string;
  badgeText: string;
  infoTooltip?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  badgeText,
  infoTooltip,
  className = "",
  children,
}) => {
  return (
    <div
      className={`
        bg-gray-800 rounded-md p-6
        ${className}
      `}
    >
      {/* Header: titlu + tooltip + badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          {infoTooltip && <Info className="w-4 h-4 text-gray-400" />}
        </div>
        <StatusBadge verdict={badgeText} />
      </div>
      {children}
    </div>
  );
};
