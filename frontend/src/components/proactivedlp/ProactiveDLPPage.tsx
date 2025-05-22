import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";

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

const ProactiveDLPPage: React.FC = () => {
  const { dataId: paramDataId } = useParams<{ dataId: string }>();
  const [dataId] = useState<string | undefined>(paramDataId);

  const [sections, setSections] = useState<SectionStatus[]>([
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
  ]);

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

  return (
    <div className="bg-gray-900 grid grid-cols-[240px_1fr] gap-8">
      <SidebarNav sections={sections} />

      <main className="p-6 space-y-12">
        <MultiScanning dataId={dataId} onStatusChange={handleMultiscan} />

        <DeepCDRCard dataId={dataId} onStatusChange={handleDeepCdr} />

        <ProactiveDLP dataId={dataId} onStatusChange={handleProactiveDLP} />
      </main>
    </div>
  );
};

export default ProactiveDLPPage;
