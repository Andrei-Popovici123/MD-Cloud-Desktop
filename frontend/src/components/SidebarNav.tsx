// src/components/SidebarNav.tsx
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
    icon: <FaShieldVirus size={24} />,
    title: "Multiscanning",
    status: "No Threats Detected",
    statusColor: "#22c55e",
  },
  {
    id: 2,
    icon: <FaCube size={24} />,
    title: "Adaptive Sandbox",
    status: "No Threats Detected",
    statusColor: "#22c55e",
  },
  {
    id: 3,
    icon: <FaClipboardList size={24} />,
    title: "Deep CDR™",
    status: "Sanitization Available",
    statusColor: "#16a34a",
  },
  {
    id: 4,
    icon: <FaFingerprint size={24} />,
    title: "Proactive DLP",
    status: "No Issues Detected",
    statusColor: "#22c55e",
  },
  {
    id: 5,
    icon: <FaExclamationTriangle size={24} />,
    title: "Vulnerabilities",
    status: "No Vulnerabilities Found",
    statusColor: "#22c55e",
  },
];

export const SidebarNav: React.FC = () => (
  <nav className="space-y-10">
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
