import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FileArchive, CornerDownRight, Check } from "lucide-react";

interface ZipEntry {
  name: string;
  size: number;
  compressedSize: number;
  dataId?: string;
}

interface Props {
  dataId?: string; // ID-ul arhivei
  selectedFileId?: string; // ID-ul fișierului activ (pentru highlight)
}

const ZipFileViewer: React.FC<Props> = ({ dataId, selectedFileId }) => {
  const [entries, setEntries] = useState<ZipEntry[]>([]);
  const [filename, setFilename] = useState<string>("archive.zip");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/file/${dataId}/zip-entries`)
      .then((res) => {
        setFilename(res.data.filename || "archive.zip");
        setEntries(res.data.entries || []);
      })
      .catch((err) => {
        console.error("ZIP viewer error:", err);
        setError("Could not load archive content.");
      });
  }, [dataId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (entries.length === 0) return null;

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white w-full max-w-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Archive Extraction</h2>

      {/* Archive Header */}
      <div className="flex items-center bg-gray-700 px-3 py-2 rounded mb-3">
        <FileArchive className="w-5 h-5 mr-2 text-white" />
        <span className="truncate">{filename}</span>
      </div>

      {/* File List */}
      <ul className="space-y-1">
        {entries.map((entry, idx) => {
          const isActive = entry.dataId === selectedFileId;

          return (
            <li
              key={idx}
              onClick={() => {
                if (entry.dataId) {
                  navigate(`/proactive-dlp/${entry.dataId}`);
                }
              }}
              className={`flex items-center px-3 py-2 rounded cursor-pointer transition
                ${
                  isActive
                    ? "bg-gray-700 text-white font-medium"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
            >
              <CornerDownRight className="w-4 h-4 mr-2 text-gray-400" />
              <span className="flex-1 truncate">{entry.name}</span>
              {entry.dataId && (
                <Check className="w-4 h-4 text-green-500 ml-2" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ZipFileViewer;
