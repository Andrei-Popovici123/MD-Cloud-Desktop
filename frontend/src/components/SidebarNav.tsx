import React from "react";
import { SidebarItem } from "./SideBarItem";
import {
  FaShieldVirus,
  FaCube,
  FaClipboardList,
  FaFingerprint,
  FaExclamationTriangle,
} from "react-icons/fa";

const items = [
  {
    id: 1,
    icon: <FaShieldVirus size={24} className="text-gray-300" />,
    title: "Multiscanning",
    status: "No Threats Detected",
    statusColor: "#008a00",
  },
  {
    id: 2,
    icon: <FaCube size={24} className="text-gray-300" />,
    title: "Adaptive Sandbox",
    status: "No Threats Detected",
    statusColor: "#008a00",
  },
  {
    id: 3,
    icon: <FaClipboardList size={24} className="text-gray-300" />,
    title: "Deep CDR™",
    status: "Sanitization Available",
    statusColor: "#008a00",
  },
  {
    id: 4,
    icon: <FaFingerprint size={24} className="text-gray-300" />,
    title: "Proactive DLP",
    status: "No Issues Detected",
    statusColor: "#008a00",
  },
  {
    id: 5,
    icon: <FaExclamationTriangle size={24} className="text-gray-300" />,
    title: "Vulnerabilities",
    status: "No Vulnerabilities Found",
    statusColor: "#008a00",
  },
];

export const SidebarNav: React.FC = () => (
  <nav
    className="
       sticky top-4
       w-64 md:w-56 sm:w-48 xs:w-40
       flex flex-col
      pt-8 pb-4 space-y-6
      max-h-screen overflow-y-auto
     "
  >
    {items.map((item) => (
      <SidebarItem
        key={item.id}
        icon={item.icon}
        title={item.title}
        status={item.status}
        statusColor={item.statusColor}
      />
    ))}
  </nav>
);
