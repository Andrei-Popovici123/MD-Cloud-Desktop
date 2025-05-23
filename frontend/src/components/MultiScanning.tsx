// src/components/MultiScanning.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import SectionCard from "./SectionCard";
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
  const [scanAllCode, setScanAllCode] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataId) return;
    setLoading(true);
    setError(null);

    axios
      .get<{
        scan_results: {
          scan_details: Record<string, any>;
          scan_all_result_i: number;
        };
      }>(`/file/${dataId}/multiscan`)
      .then(({ data }) => {
        const arr: EngineDetail[] = Object.entries(
          data.scan_results.scan_details
        ).map(([engine, d]) => ({
          engine,
          scan_result_i: d.scan_result_i,
          lastUpdate: d.def_time ? new Date(d.def_time).toLocaleString() : "",
        }));
        setDetails(arr);
        setScanAllCode(data.scan_results.scan_all_result_i);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Eroare la încărcarea scanărilor");
      })
      .finally(() => setLoading(false));
  }, [dataId]);

  const textMap: Record<number, string> = {
    0: "No Threats Detected",
    1: "Threats Detected",
    2: "Type Not Supported",
    3: "Analysis Error",
    4: "Type Not Recognized",
    5: "Suspicious File",
    6: "File Error",
    7: "File Too Large",
    8: "Scanning...",
    9: "Idle",
    10: "Processing",
    11: "Timeout",
    12: "Memory Error",
    13: "Network Error",
    14: "Permission Denied",
    15: "Expired Definition",
    16: "Unsupported Archive Type",
  };

  const variantMap: Record<number, "success" | "warning" | "danger"> = {
    0: "success",
    1: "danger",
    2: "warning",
    3: "danger",
    4: "warning",
    5: "warning",
    6: "danger",
    7: "warning",
    8: "warning",
    9: "warning",
    10: "warning",
    11: "danger",
    12: "danger",
    13: "danger",
    14: "danger",
    15: "warning",
    16: "warning",
  };

  // fallback to code 0 if scanAllCode isn't defined in our maps
  const badgeText = loading
    ? "Scanning..."
    : error
    ? "Error Fetching Scan"
    : textMap[scanAllCode] ?? textMap[0];

  const badgeVariant = loading
    ? "warning"
    : error
    ? "danger"
    : variantMap[scanAllCode] ?? variantMap[0];

  useEffect(() => {
    onStatusChange(badgeText, badgeVariant);
  }, [badgeText, badgeVariant, onStatusChange]);

  const detectedCount = details.filter((d) => d.scan_result_i === 1).length;
  const totalEngines = details.length;

  return (
    <SectionCard
      id="multiscanning-card"
      title="Multiscanning"
      badgeText={badgeText}
      badgeVariant={badgeVariant}
      infoTooltip="Scanarea fișierului pe multiple motoare antivirus."
      headerRight={
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-bold text-white">{detectedCount}</span>
          <span className="text-sm text-gray-400">/{totalEngines} ENGINES</span>
        </div>
      }
    >
      {loading && (
        <div className="text-gray-300">Se încarcă rezultatele scanării…</div>
      )}
      {error && <div className="text-red-500">Eroare: {error}</div>}
      {!loading && !error && (
        <table className="min-w-full table-auto text-left text-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Engine Name</th>
              <th className="px-4 py-2">Verdict</th>
              <th className="px-4 py-2">Last Engine Update</th>
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
    </SectionCard>
  );
};

export default MultiScanning;
