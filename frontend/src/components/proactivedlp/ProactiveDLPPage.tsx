import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import SidebarNav from "../SidebarNav";
import MultiScanning from "../MultiScanning";
import { DeepCDRCard } from "../DeepCDRCard";
import ProactiveDLP from "./ProactiveDLP";

export type Variant = "success" | "warning" | "danger";

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

const ProactiveDLPPage: React.FC = () => {
  const { dataId: paramDataId } = useParams<{ dataId: string }>();
  const dataId = paramDataId;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sections, setSections] = useState<SectionStatus[]>(initialSections);

  // Reset sections when a new file is loaded
  useEffect(() => {
    setSections(initialSections);
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

  // File upload handlers
  const onAddFileClick = () => fileInputRef.current?.click();

  const uploadFile = (file: File) => {
    const form = new FormData();
    form.append("file", file);
    axios
      .post<{ dataId: string }>("/file", form)
      .then((res) => {
        const id = res.data.dataId;
        navigate(`/${id}`, { replace: true });
      })
      .catch((err) => console.error("Upload failed", err));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // reset input to allow same file selection
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
    <div onDrop={onDrop} onDragOver={onDragOver} className="min-h-screen">
      {/* Header bar */}
      <div className="bg-gray-800 flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-2">
          <h1 className="text-white text-lg font-semibold">
            MetaDefender Cloud
          </h1>
          <span className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded">
            Community
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
          <input
            type="text"
            placeholder="Analyze a File, URL, IP address, Domain, Hash, or CVE"
            className="bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-1 rounded focus:outline-none"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="bg-gray-900 grid grid-cols-[240px_1fr] gap-8">
        <SidebarNav sections={sections} />

        <main key={dataId} className="p-6 space-y-12">
          <MultiScanning dataId={dataId} onStatusChange={handleMultiscan} />
          <DeepCDRCard dataId={dataId} onStatusChange={handleDeepCdr} />
          <ProactiveDLP dataId={dataId} onStatusChange={handleProactiveDLP} />
        </main>
      </div>
    </div>
  );
};

export default ProactiveDLPPage;
