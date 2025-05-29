import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import SidebarNav from "../SidebarNav";
import MultiScanning from "../MultiScanning";
import { DeepCDRCard } from "../DeepCDRCard";
import ProactiveDLP from "./ProactiveDLP";
import ZipFileViewer from "../ZipFileViewer";

export type Variant = "success" | "warning" | "danger" | "neutral";

export interface SectionStatus {
  id: string;
  title: string;
  badgeText: string;
  badgeVariant: Variant;
}

const initialSections: SectionStatus[] = [
  {
    id: "multiscanning",
    title: "Multiscanning",
    badgeText: "No Threats Detected",
    badgeVariant: "success",
  },
  {
    id: "adaptive-sandbox",
    title: "Adaptive Sandbox",
    badgeText: "No Threats Detected",
    badgeVariant: "success",
  },
  {
    id: "deep-cdr",
    title: "Deep CDR™",
    badgeText: "Sanitization Available",
    badgeVariant: "success",
  },
  {
    id: "proactive-dlp",
    title: "Proactive DLP",
    badgeText: "No Issues Detected",
    badgeVariant: "success",
  },
  {
    id: "vulnerabilities",
    title: "Vulnerabilities",
    badgeText: "No Vulnerabilities Found",
    badgeVariant: "success",
  },
];

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const ProactiveDLPPage: React.FC = () => {
  const { dataId: paramDataId } = useParams<{ dataId: string }>();
  const dataId = paramDataId;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sections, setSections] = useState<SectionStatus[]>(initialSections);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setSections(initialSections);
    if (dataId) {
      setShowModal(true);
      setProgress(0);

      const interval = setInterval(async () => {
        try {
          const [multiScanRes, cdrRes] = await Promise.all([
            axios.get<{ scan_results: { progress_percentage: number } }>(
              `/file/${dataId}`
            ),
            axios.get<{ process_info: { progress_percentage: number } }>(
              `/file/${dataId}/cdr`
            ),
          ]);

          const multiProgress =
            multiScanRes.data.scan_results.progress_percentage || 0;
          const cdrProgress = cdrRes.data.process_info.progress_percentage || 0;

          const combinedProgress = Math.min(multiProgress, cdrProgress);
          setProgress(combinedProgress);

          if (multiProgress >= 100 && cdrProgress >= 100) {
            clearInterval(interval);
            setShowModal(false);
          }
        } catch (err) {
          console.error("Error polling scan progress", err);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dataId]);

  const updateSection = useCallback(
    (id: string, badgeText: string, badgeVariant: Variant) => {
      setSections((all) =>
        all.map((sec) =>
          sec.id === id ? { ...sec, badgeText, badgeVariant } : sec
        )
      );
    },
    []
  );

  const handleMultiscan = useCallback(
    (text: string, variant: Variant) =>
      updateSection("multiscanning", text, variant),
    [updateSection]
  );
  const handleDeepCdr = useCallback(
    (text: string, variant: Variant) =>
      updateSection("deep-cdr", text, variant),
    [updateSection]
  );
  const handleProactiveDLP = useCallback(
    (text: string, variant: Variant) =>
      updateSection("proactive-dlp", text, variant),
    [updateSection]
  );

  const onAddFileClick = () => fileInputRef.current?.click();
  const uploadFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File is too big. Maximum size is 4 MB.");
      return;
    }

    setUploadError(null);
    const form = new FormData();
    form.append("file", file);
    axios
      .post<{ dataId: string }>("/upload", form)
      .then((res) =>
        navigate(`/proactive-dlp/${res.data.dataId}`, { replace: true })
      )
      .catch((err) => console.error("Upload failed", err));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      uploadFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Scanning File...</h2>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p>{progress}% complete</p>
          </div>
        </div>
      )}

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="min-h-screen pt-16 bg-gray-800"
      >
        <div className="fixed top-0 left-0 w-full z-50 bg-gray-800 flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-white text-lg font-semibold">
              MetaDefender Cloud
            </h1>
            <span className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded">
              MD Desktop
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={onFileChange}
            />
            <button
              onClick={onAddFileClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              Add a file
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="px-6 py-4 bg-red-500 text-white text-center">
            {uploadError}
          </div>
        )}

        <div className="bg-gray-900 grid grid-cols-[240px_1fr]">
          <SidebarNav sections={sections} />
          <main key={dataId} className="px-6 py-6 space-y-6">
            <ZipFileViewer dataId={dataId} />
            <MultiScanning
              key={`multi-${dataId}`}
              dataId={dataId}
              onStatusChange={handleMultiscan}
            />
            <DeepCDRCard
              key={`cdr-${dataId}`}
              dataId={dataId}
              onStatusChange={handleDeepCdr}
            />
            <ProactiveDLP dataId={dataId} onStatusChange={handleProactiveDLP} />
          </main>
        </div>
      </div>
    </>
  );
};

export default ProactiveDLPPage;
