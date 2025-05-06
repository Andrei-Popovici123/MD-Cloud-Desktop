import React, { useEffect, useState } from "react";
import { ScanResult, ScanResultsTable } from "./ScanResultsTable";

const MultiScanning: React.FC = () => {
  const [results, setResults] = useState<ScanResult[]>([]);

  useEffect(() => {
    // Mock data; replace with actual fetch as needed
    setResults([
      {
        engineName: "AhnLab",
        verdict: "No Threats Detected",
        lastUpdate: "04/09/2025 04:47 AM GMT",
      },
      {
        engineName: "Avira",
        verdict: "No Threats Detected",
        lastUpdate: "04/09/2025 09:49 AM GMT",
      },
      {
        engineName: "CrowdStrike Falcon ML",
        verdict: "Unsupported File Type",
        lastUpdate: "04/09/2025 04:47 AM GMT",
        unsupported: true,
      },
    ]);
  }, []);

  const supportedCount = results.filter((r) => !r.unsupported).length;
  const totalEngines = results.length;
  const anyThreats = results.some((r) => r.verdict !== "No Threats Detected");

  return (
    <div
      id="multiscanning-card"
      className="bg-gray-800 rounded-lg p-4 md:p-6 space-y-3 md:space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg md:text-xl font-semibold">
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
          <span className="text-white font-bold text-sm">
            {supportedCount}/{totalEngines} ENGINES
          </span>
        </div>
      </div>

      <hr className="border-gray-700" />

      <ScanResultsTable results={results} />
    </div>
  );
};

export default MultiScanning;
