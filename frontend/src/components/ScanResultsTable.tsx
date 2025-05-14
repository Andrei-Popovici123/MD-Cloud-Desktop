import React from "react";
import { StatusBadge } from "./StatusBadge";

export interface ScanResult {
  engineName: string;
  verdict: string;
  lastUpdate: string;
  unsupported?: boolean;
}

interface ScanResultsTableProps {
  results: ScanResult[];
}

export const ScanResultsTable: React.FC<ScanResultsTableProps> = ({
  results,
}) => {
  const cleanCount = results.filter((r) => !r.unsupported).length;
  const total = results.length;

  return (
    <div className="bg-gray-800 rounded-md p-6 overflow-auto">
      <div className="flex flex-col mb-4">
        <h3 className="text-xl font-semibold text-white">Multiscanning</h3>

        <div className="flex items-center space-x-6 mt-2">
          <StatusBadge verdict="No Threats Detected" />

          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-semibold text-white">
              {cleanCount}
            </span>
            <span className="text-lg font-semibold text-white">
              /{total} ENGINES
            </span>
          </div>
        </div>
      </div>

      <hr className="border-gray-700 mb-4" />

      {/* Tabel */}
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="text-gray-400 border-b border-gray-600">
            <th className="py-2 px-4">Engine Name</th>
            <th className="py-2 px-4">Verdict</th>
            <th className="py-2 px-4">Last engine update</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr
              key={r.engineName}
              className="border-b border-gray-700 hover:bg-gray-700"
            >
              <td className="py-2 px-4 text-white">{r.engineName}</td>
              <td className="py-2 px-4">
                <StatusBadge verdict={r.verdict} unsupported={r.unsupported} />
              </td>
              <td className="py-2 px-4 text-gray-400">{r.lastUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
