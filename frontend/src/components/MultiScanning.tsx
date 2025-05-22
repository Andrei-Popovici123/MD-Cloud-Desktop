import React, { useEffect, useState } from "react";
import axios from "axios";
import { StatusBadge } from "./StatusBadge";
import { StatusBadgeScan } from "./StatusBadgeScan";

export interface MultiScanningProps {
  dataId?: string;
  onStatusChange: (
    text: string,
    variant: "success" | "warning" | "danger"
  ) => void;
}

interface EngineDetail {
  engine: string;
  scan_result_i: number;
  lastUpdate: string;
}

const MultiScanning: React.FC<MultiScanningProps> = ({
  dataId,
  onStatusChange,
}) => {
  const [details, setDetails] = useState<EngineDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataId) return;
    setLoading(true);
    setError(null);

    axios
      .get<{ scan_results: { scan_details: Record<string, any> } }>(
        `/file/${dataId}/multiscan`
      )
      .then(({ data }) => {
        const entries = data.scan_results.scan_details;
        const arr = Object.entries(entries).map(([engine, d]) => ({
          engine,
          scan_result_i: d.scan_result_i,
          lastUpdate: d.def_time ? new Date(d.def_time).toLocaleString() : "",
        }));
        setDetails(arr);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Eroare la încărcarea scanărilor");
      })
      .finally(() => setLoading(false));
  }, [dataId]);

  const detectedCount = details.filter((d) => d.scan_result_i === 1).length;
  const totalEngines = details.length;

  const badgeText = loading
    ? "Scanning..."
    : error
    ? "Error Fetching Scan"
    : detectedCount > 0
    ? "Threats Detected"
    : "No Threats Found";
  const badgeVariant: "success" | "warning" | "danger" = loading
    ? "warning"
    : error
    ? "danger"
    : detectedCount > 0
    ? "danger"
    : "success";

  useEffect(() => {
    onStatusChange(badgeText, badgeVariant);
  }, [badgeText, badgeVariant, onStatusChange]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      {/* Header: title + badge inline, divider, count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-white text-xl font-semibold">Multiscanning</h2>
          <StatusBadgeScan
            verdictCode={detectedCount > 0 ? 1 : 0}
            unsupported={false}
          />
        </div>
        <div className="flex items-baseline space-x-2 border-l border-gray-600 pl-4">
          <span className="text-5xl font-bold text-white">{detectedCount}</span>
          <span className="text-sm text-gray-400">/{totalEngines} ENGINES</span>
        </div>
      </div>

      <hr className="border-gray-600 mb-4" />

      {loading && <div>Se încarcă rezultatele scanării…</div>}
      {error && <div className="text-red-500">Eroare: {error}</div>}

      {!loading && !error && (
        <table className="min-w-full table-auto text-left text-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Engine Name</th>
              <th className="px-4 py-2">Verdict</th>
              <th className="px-4 py-2">Last engine update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {details.map((d) => (
              <tr key={d.engine}>
                <td className="px-4 py-2">{d.engine}</td>
                <td className="px-4 py-2">
                  <StatusBadgeScan
                    verdictCode={d.scan_result_i}
                    unsupported={false}
                  />
                </td>
                <td className="px-4 py-2">{d.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MultiScanning;
