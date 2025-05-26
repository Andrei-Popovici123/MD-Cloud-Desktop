import React from "react";
import {
  FaShieldVirus,
  FaCube,
  FaClipboardList,
  FaFingerprint,
  FaExclamationTriangle,
} from "react-icons/fa";

export interface Section {
  id: string;
  title: string;
  badgeText: string;
  badgeVariant: "success" | "warning" | "danger" | "neutral";
}

interface SidebarNavProps {
  sections: Section[];
}

const iconsMap: Record<string, React.ReactNode> = {
  multiscanning: <FaShieldVirus size={24} />,
  "adaptive-sandbox": <FaCube size={24} />,
  "deep-cdr": <FaClipboardList size={24} />,
  "proactive-dlp": <FaFingerprint size={24} />,
  vulnerabilities: <FaExclamationTriangle size={24} />,
};

const colorMap: Record<Section["badgeVariant"], string> = {
  success: "#008a00",
  warning: "#f59e0b",
  danger: "#dc2626",
  neutral: "#6b7280",
};

const SidebarNav: React.FC<SidebarNavProps> = ({ sections }) => {
  const handleClick = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="bg-gray-900 sticky top-12 bottom-0 h-[calc(100vh-1rem)] overflow-y-auto w-64 space-y-6 pt-6 px-5">
      {sections.map((sec) => {
        const statusColor = colorMap[sec.badgeVariant];
        return (
          <div
            key={sec.id}
            onClick={() => handleClick(`${sec.id}-card`)}
            className="cursor-pointer"
          >
            <div
              className="flex items-center bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition"
              style={{ borderLeft: `4px solid ${statusColor}` }}
            >
              <div className="flex-shrink-0" style={{ color: statusColor }}>
                {iconsMap[sec.id] || null}
              </div>
              <div className="ml-3">
                <div className="text-gray-100 font-medium">{sec.title}</div>
                <div
                  className="mt-1 inline-block text-xs font-semibold text-white px-2 py-0.5 rounded"
                  style={{ backgroundColor: statusColor }}
                >
                  {sec.badgeText}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
