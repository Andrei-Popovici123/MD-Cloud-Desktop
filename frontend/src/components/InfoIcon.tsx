import React from "react";
import { Info } from "lucide-react";

interface InfoIconProps {
  tooltip?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({ tooltip }) => (
  <div className="relative inline-block group">
    <Info className="w-4 h-4 text-gray-400" />
    {tooltip && (
      <div
        className="
        absolute bottom-full left-1/2 transform -translate-x-1/2
        mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded
        opacity-0 group-hover:opacity-100 transition-opacity
      "
      >
        {tooltip}
      </div>
    )}
  </div>
);
