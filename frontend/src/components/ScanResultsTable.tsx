import React from "react";
import { StatusBadgeScan } from "./StatusBadgeScan";

export interface ScanDetail {
  engine: string;
  scan_result_i: number;
  // Other fields like scan_time, def_time, etc.
}

export interface ScanResultsTableProps {
  data: ScanDetail[];
}

export const ScanResultsTable: React.FC<ScanResultsTableProps> = ({ data }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Engine
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Verdict
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((detail) => {
          // unsupported if code is 18 or 23
          const isUnsupported =
            detail.scan_result_i === 18 || detail.scan_result_i === 23;
          return (
            <tr key={detail.engine}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {detail.engine}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadgeScan
                  verdictCode={detail.scan_result_i}
                  unsupported={isUnsupported}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
