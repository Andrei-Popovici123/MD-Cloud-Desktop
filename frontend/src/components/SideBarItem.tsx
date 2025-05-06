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
  <div className="flex items-center bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition">
    <div className="p-2 bg-gray-700 rounded-md">{icon}</div>
    <div className="ml-4">
      <div className="text-gray-100 font-medium">{title}</div>
      <div
        className="mt-1 inline-block text-xs font-semibold text-white px-2 py-0.5 rounded whitespace-nowrap"
        style={{ backgroundColor: statusColor }}
      >
        {status}
      </div>
    </div>
  </div>
);
