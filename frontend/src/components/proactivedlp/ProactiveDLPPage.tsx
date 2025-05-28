// import React, { useState, useCallback, useRef, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// import SidebarNav from "../SidebarNav";
// import MultiScanning from "../MultiScanning";
// import { DeepCDRCard } from "../DeepCDRCard";
// import ProactiveDLP from "./ProactiveDLP";

// export type Variant = "success" | "warning" | "danger" | "neutral";

// export interface SectionStatus {
//   id: string;
//   title: string;
//   badgeText: string;
//   badgeVariant: Variant;
// }

// const initialSections: SectionStatus[] = [
//   {
//     id: "multiscanning",
//     title: "Multiscanning",
//     badgeText: "No Threats Detected",
//     badgeVariant: "success",
//   },
//   {
//     id: "adaptive-sandbox",
//     title: "Adaptive Sandbox",
//     badgeText: "No Threats Detected",
//     badgeVariant: "success",
//   },
//   {
//     id: "deep-cdr",
//     title: "Deep CDR™",
//     badgeText: "Sanitization Available",
//     badgeVariant: "success",
//   },
//   {
//     id: "proactive-dlp",
//     title: "Proactive DLP",
//     badgeText: "No Issues Detected",
//     badgeVariant: "success",
//   },
//   {
//     id: "vulnerabilities",
//     title: "Vulnerabilities",
//     badgeText: "No Vulnerabilities Found",
//     badgeVariant: "success",
//   },
// ];

// const ProactiveDLPPage: React.FC = () => {
//   const { dataId: paramDataId } = useParams<{ dataId: string }>();
//   const dataId = paramDataId;
//   const navigate = useNavigate();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [sections, setSections] = useState<SectionStatus[]>(initialSections);

//   // Reset sections when a new file is loaded
//   useEffect(() => {
//     setSections(initialSections);
//   }, [dataId]);

//   const updateSection = useCallback(
//     (id: string, badgeText: string, badgeVariant: Variant) => {
//       setSections((all) =>
//         all.map((sec) =>
//           sec.id === id ? { ...sec, badgeText, badgeVariant } : sec
//         )
//       );
//     },
//     []
//   );

//   const handleMultiscan = useCallback(
//     (text: string, variant: Variant) =>
//       updateSection("multiscanning", text, variant),
//     [updateSection]
//   );

//   const handleDeepCdr = useCallback(
//     (text: string, variant: Variant) =>
//       updateSection("deep-cdr", text, variant),
//     [updateSection]
//   );

//   const handleProactiveDLP = useCallback(
//     (text: string, variant: Variant) =>
//       updateSection("proactive-dlp", text, variant),
//     [updateSection]
//   );

//   // File upload handlers
//   const onAddFileClick = () => fileInputRef.current?.click();

//   const uploadFile = (file: File) => {
//     const form = new FormData();
//     form.append("file", file);
//     axios
//       .post<{ dataId: string }>("/file", form)
//       .then((res) => {
//         const id = res.data.dataId;
//         navigate(`/${id}`, { replace: true });
//       })
//       .catch((err) => console.error("Upload failed", err));
//   };

//   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) uploadFile(file);
//     // reset input to allow same file selection
//     e.target.value = "";
//   };

//   const onDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     if (e.dataTransfer.files?.length) {
//       uploadFile(e.dataTransfer.files[0]);
//       e.dataTransfer.clearData();
//     }
//   };

//   const onDragOver = (e: React.DragEvent) => e.preventDefault();

//   return (
//     <div onDrop={onDrop} onDragOver={onDragOver} className="min-h-screen">
//       {/* Header bar */}
//       <div className="bg-gray-800 flex items-center justify-between px-6 py-3">
//         <div className="flex items-center space-x-2">
//           <h1 className="text-white text-lg font-semibold">
//             MetaDefender Cloud
//           </h1>
//           <span className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded">
//             Community
//           </span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <input
//             ref={fileInputRef}
//             type="file"
//             className="hidden"
//             onChange={onFileChange}
//           />
//           <button
//             onClick={onAddFileClick}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
//           >
//             Add a file
//           </button>
//           <input
//             type="text"
//             placeholder="Analyze a File, URL, IP address, Domain, Hash, or CVE"
//             className="bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-1 rounded focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="bg-gray-900 grid grid-cols-[240px_1fr] gap-8">
//         <SidebarNav sections={sections} />

//         <main key={dataId} className="p-6 space-y-12">
//           <MultiScanning dataId={dataId} onStatusChange={handleMultiscan} />
//           <DeepCDRCard dataId={dataId} onStatusChange={handleDeepCdr} />
//           <ProactiveDLP dataId={dataId} onStatusChange={handleProactiveDLP} />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ProactiveDLPPage;
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import SidebarNav from "../SidebarNav";
import MultiScanning from "../MultiScanning";
import { DeepCDRCard } from "../DeepCDRCard";
import ProactiveDLP from "./ProactiveDLP";

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

const ProactiveDLPPage: React.FC = () => {
  const { dataId: paramDataId } = useParams<{ dataId: string }>();
  const dataId = paramDataId;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sidebar state
  const [sections, setSections] = useState<SectionStatus[]>(initialSections);
  // Modal loading state
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset sidebar badges and start polling when dataId changes
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

  // Section update helper
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

  // Handlers
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

  // File upload
  const onAddFileClick = () => fileInputRef.current?.click();
  const uploadFile = (file: File) => {
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
      {/* Loading modal until scans complete */}
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
        {/* Header */}
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
            {/* <input
              type="text"
              placeholder="Analyze a File, URL, IP address, Domain, Hash, or CVE"
              className="bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-1 rounded focus:outline-none"
            /> */}
          </div>
        </div>

        {/* Main content */}
        <div className="bg-gray-900 grid grid-cols-[240px_1fr] ">
          <SidebarNav sections={sections} />
          <main key={dataId} className="px-6 py-6 space-y-6">
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
