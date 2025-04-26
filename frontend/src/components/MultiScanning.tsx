import React from "react";
import { SidebarNav } from "../components/SidebarNav";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { ScanResult, ScanResultsTable } from "./ScanResultsTable";

const MultiScanning: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  useEffect(() => {
    // fetch("/api/multiscan").then(r => r.json()).then(setResults);

    // mock:
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
      // …
      {
        engineName: "CrowdStrike Falcon ML",
        verdict: "Unsupported File Type",
        lastUpdate: "04/09/2025 04:47 AM GMT",
        unsupported: true,
      },
    ]);
  }, []);

  const file = {
    type: "TXT",
    name: "dnd notes",
    coo: null as string | null,
    hash: "AB07B7CD71B01FF38634BB48C8B9727AB0F84A63BDD83466A8BB1FFEFBAEA449",
  };
  const handleAddFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // logica ta de procesare aici
      console.log("Selected file:", file);
    }
  };

  return (
    <div
      className="
        bg-black border-2 border-black
        grid grid-cols-[20%_80%] grid-rows-[20vh_auto]
        h-full
      "
    >
      {/* DIV2: header cu butoane + processed file info */}
      <div className="col-span-2 flex items-center justify-between px-6 border-b border-gray-700">
        {/* aici e cadranul */}
        <div
          className="
            flex items-center
            border border-gray-600 rounded-lg
            overflow-hidden
        "
        >
          {/* textul din stânga */}
          <span className="px-4 py-2 text-gray-400 whitespace-nowrap">
            Analyze a File
          </span>
          {/* butonul din dreapta */}
          <button
            onClick={handleAddFileClick}
            className="
              px-4 py-2
              bg-blue-600 hover:bg-blue-500
              text-white font-medium
              transition
              whitespace-nowrap
            "
          >
            Add a file
          </button>
        </div>

        <div className="flex items-center space-x-6">
          {/* icon + filename */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
              <span className="font-mono text-sm text-white">{file.type}</span>
            </div>
            <span className="text-white">{file.name}</span>
          </div>
          {/* COO */}
          <div className="flex items-center space-x-1 text-sm">
            {file.coo ? (
              <span className="text-white">{file.coo}</span>
            ) : (
              <>
                <span className="text-gray-500">Not Available</span>
                <span className="text-gray-500">(Country of Origin)</span>
                <button className="text-blue-400 hover:underline ml-2">
                  Add COO
                </button>
              </>
            )}
          </div>

          <div className="text-sm text-gray-400">
            SHA-256:{" "}
            <span className="font-mono text-xs break-all">{file.hash}</span>
          </div>
        </div>
      </div>

      {/* DIV3: sidebar */}
      <div className="border-r-2 p-4">
        <SidebarNav />
      </div>

      {/* DIV4: table */}
      <div className="col-span-1 p-4">
        {" "}
        <ScanResultsTable results={results} />
      </div>
    </div>
  );
};

export default MultiScanning;
