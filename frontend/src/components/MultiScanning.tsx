import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScanResultsTable } from "./ScanResultsTable";

export type Variant = "success" | "warning" | "danger";

export interface ScanResult {
  engineName: string;
  verdict: string;
  lastUpdate: string;
  unsupported?: boolean;
}

export interface MultiScanningProps {
  dataId?: string;

  onStatusChange: (text: string, variant: Variant) => void;
}

const MultiScanning: React.FC<MultiScanningProps> = ({
  dataId,
  onStatusChange,
}) => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
        const details = data.scan_results.scan_details;
        const arr: ScanResult[] = Object.entries(details).map(
          ([engineName, d]) => ({
            engineName,
            verdict: d.threat_found || "No Threat Detected",
            lastUpdate: d.def_time?.$date
              ? new Date(d.def_time.$date).toLocaleString()
              : new Date(d.def_time).toLocaleString(),
            unsupported: d.scan_result_i !== 0,
          })
        );
        setResults(arr);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Eroare la încărcarea scanărilor");
      })
      .finally(() => setLoading(false));
  }, [dataId]);

  const anyThreats = results.some((r) => r.verdict !== "No Threat Detected");
  const badgeText = loading
    ? "Scanning..."
    : error
    ? "Error Fetching Scan"
    : anyThreats
    ? "Threats Detected"
    : "No Threats Detected";
  const badgeVariant: Variant = loading
    ? "warning"
    : error
    ? "danger"
    : anyThreats
    ? "danger"
    : "success";

  useEffect(() => {
    onStatusChange(badgeText, badgeVariant);
  }, [badgeText, badgeVariant, onStatusChange]);

  const renderBody = () => {
    if (!dataId) {
      return (
        <div className="text-gray-400">
          Niciun fișier selectat pentru scanare.
        </div>
      );
    }
    if (loading) {
      return <div>Se încarcă rezultatele scanării…</div>;
    }
    if (error) {
      return <div className="text-red-500">Eroare: {error}</div>;
    }
    if (results.length === 0) {
      return <div className="text-gray-400">Nicio scanare disponibilă.</div>;
    }
    return <ScanResultsTable results={results} />;
  };

  return <div className="space-y-4">{renderBody()}</div>;
};

export default MultiScanning;
