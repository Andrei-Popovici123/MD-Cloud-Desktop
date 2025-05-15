import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScanResultsTable } from "./ScanResultsTable";

export interface ScanResult {
  engineName: string;
  verdict: string;
  lastUpdate: string;
  unsupported?: boolean;
}

export interface MultiScanningProps {
  /** ID-ul fișierului încărcat pentru scanare */
  dataId?: string;
}

const MultiScanning: React.FC<MultiScanningProps> = ({ dataId }) => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataId) {
      return; // fără dataId, nu facem fetch
    }

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

  // Determinăm starea pentru header
  const anyThreats = results.some((r) => r.verdict !== "No Threat Detected");
  const supportedCount = results.filter((r) => !r.unsupported).length;
  const totalEngines = results.length;

  return (
    <div
      id="multiscanning-card"
      className="bg-gray-800 rounded-lg p-4 md:p-6 space-y-3 md:space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg md:text-xl font-bold">
          Multiscanning
        </h3>
        <div className="flex items-center space-x-4">
          <span
            className={`inline-block px-2 py-1 rounded text-xs sm:text-sm text-white ${
              anyThreats ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {anyThreats ? "Threats Detected" : "No Threats Detected"}
          </span>
          {dataId && (
            <span className="text-white font-bold text-sm">
              {supportedCount}/{totalEngines} ENGINES
            </span>
          )}
        </div>
      </div>
      <hr className="border-gray-700" />
      {renderBody()}
    </div>
  );
};

export default MultiScanning;
