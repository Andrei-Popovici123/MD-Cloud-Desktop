import React from "react";
import { SidebarItem } from "./SideBarItem";
import {
  FaShieldVirus,
  FaCube,
  FaClipboardList,
  FaFingerprint,
  FaExclamationTriangle,
} from "react-icons/fa";

// Sidebar items with their scroll targets
const items = [
  {
    id: "multiscanning",
    icon: <FaShieldVirus size={24} className="text-gray-300" />,
    title: "Multiscanning",
    status: "No Threats Detected",
    statusColor: "#008a00",
    targetId: "multiscanning-card",
  },
  {
    id: "adaptive-sandbox",
    icon: <FaCube size={24} className="text-gray-300" />,
    title: "Adaptive Sandbox",
    status: "No Threats Detected",
    statusColor: "#008a00",
    // no target → no scroll
  },
  {
    id: "deep-cdr",
    icon: <FaClipboardList size={24} className="text-gray-300" />,
    title: "Deep CDR™",
    status: "Sanitization Available",
    statusColor: "#008a00",
    targetId: "deep-cdr-card",
  },
  {
    id: "proactive-dlp",
    icon: <FaFingerprint size={24} className="text-gray-300" />,
    title: "Proactive DLP",
    status: "No Issues Detected",
    statusColor: "#008a00",
    targetId: "proactive-dlp-card",
  },
  {
    id: "vulnerabilities",
    icon: <FaExclamationTriangle size={24} className="text-gray-300" />,
    title: "Vulnerabilities",
    status: "No Vulnerabilities Found",
    statusColor: "#008a00",
    // no target → no scroll
  },
];

export const SidebarNav: React.FC = () => {
  const handleClick = (targetId?: string) => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-4 w-64 md:w-56 sm:w-48 xs:w-40 flex flex-col pt-8 pb-4 space-y-6 max-h-screen overflow-y-auto ">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleClick(item.targetId)}
          className="cursor-pointer px-2"
        >
          <SidebarItem
            icon={item.icon}
            title={item.title}
            status={item.status}
            statusColor={item.statusColor}
          />
        </div>
      ))}
    </nav>
  );
};
