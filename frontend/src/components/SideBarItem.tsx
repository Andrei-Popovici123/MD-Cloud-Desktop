import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  statusColor: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  status,
  statusColor,
}) => (
  <div className="flex items-start w-full bg-gray-800 px-6 py-3 rounded-lg hover:bg-gray-700 transition">
    {/* Icon */}
    <div className="p-2 bg-gray-700 rounded-md flex-shrink-0 w-8 h-8">
      {icon}
    </div>

    {/* Content: Title + Status */}
    <div className="ml-3 flex flex-col">
      <div className="text-gray-100 font-medium whitespace-nowrap">{title}</div>
      <div
        className="text-xs font-semibold text-white px-2 py-0.5 rounded mt-1 self-start whitespace-nowrap"
        style={{ backgroundColor: statusColor }}
      >
        {status}
      </div>
    </div>
  </div>
);
