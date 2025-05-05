import React from "react";
import { SectionCard } from "./SectionCard";
import { Info, ExternalLink } from "lucide-react";
import illustration from "../assets/deepcdr-illustration.png";

const data = [
  { object: "Custom XML", action: "Not Present" },
  { object: "External Image", action: "Not Present" },
  { object: "Hyperlink", action: "Not Present" },
  { object: "Image", action: "Not Present" },
];

export const DeepCDRCard: React.FC = () => {
  return (
    <SectionCard
      title="Deep CDR™ Regeneration"
      badgeText="Sanitization Available"
      infoTooltip="Files are sanitized by removing unsupported objects and regenerating safe formats."
      className="relative overflow-hidden"
    >
      {/* Top-right download button and expand icon */}
      <div className="absolute top-6 right-6 flex items-center space-x-2">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded">
          Download Sanitized Version
        </button>
        <ExternalLink className="w-5 h-5 text-gray-400 hover:text-white" />
      </div>

      {/* Section heading */}
      <h5 className="text-gray-300 text-sm mb-3">After Data Sanitization</h5>

      {/* Table of objects and actions */}
      <div className="overflow-auto relative z-0">
        <table className="w-full text-left text-gray-200 text-sm">
          <thead>
            <tr>
              <th className="pb-2">Object</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.object} className="border-t border-gray-700">
                <td className="py-2">{row.object}</td>
                <td className="py-2">
                  <span className="inline-block px-2 py-0.5 text-xs text-white bg-gray-600 rounded">
                    {row.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Illustration on right */}
      <div className="absolute bottom-4 right-8 opacity-20 z-10">
        <img
          src={illustration}
          alt="Document sanitization illustration"
          className="w-40 h-40 md:w-48 md:h-48"
        />
      </div>
    </SectionCard>
  );
};
