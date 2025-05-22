import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SectionCard } from "../SectionCard";
import { DLPItemCard, DLPItemCardProps } from "./DLPItemCard";
import {
  CreditCard,
  User,
  ShieldCheck,
  Globe,
  Router,
  AlertCircle,
  FileText,
  EyeOff,
  Code,
  ExternalLink as ExternalLinkIcon,
} from "lucide-react";

export type Variant = "success" | "warning" | "danger";

const defaultLabels: Record<string, string> = {
  "credit-card": "Credit Card Number (CCN)",
  ssn: "Social Security Number (SSN)",
  "govt-ids": "Government IDs",
  ipv4: "IPv4 address or subnet mask",
  "inter-domain": "Classless Inter-Domain Routing",
  "adult-content": "Adult Content",
  "personal-id-docs": "Personal Identity Documents",
  "secrets-text": "Secrets in Text Files",
  "custom-regex": "Custom Regular Expressions (RegEx)",
};

const apiKeyToUiId: Record<string, string> = {
  ccn: "credit-card",
  ssn: "ssn",
  government_ids: "govt-ids",
  ipv4: "ipv4",
  classless_inter_domain_routing: "inter-domain",
  adult_content: "adult-content",
  personal_identity_documents: "personal-id-docs",
  secrets_in_text_files: "secrets-text",
  custom_regular_expressions: "custom-regex",
};

const iconMap: Record<string, React.ReactNode> = {
  "credit-card": <CreditCard className="w-5 h-5 text-gray-300" />,
  ssn: <User className="w-5 h-5 text-gray-300" />,
  "govt-ids": <ShieldCheck className="w-5 h-5 text-gray-300" />,
  ipv4: <Globe className="w-5 h-5 text-gray-300" />,
  "inter-domain": <Router className="w-5 h-5 text-gray-300" />,
  "adult-content": <AlertCircle className="w-5 h-5 text-gray-300" />,
  "personal-id-docs": <FileText className="w-5 h-5 text-gray-300" />,
  "secrets-text": <EyeOff className="w-5 h-5 text-gray-300" />,
  "custom-regex": <Code className="w-5 h-5 text-gray-300" />,
};

export interface ProactiveDLPProps {
  /** ID-ul fișierului pentru analiza DLP */
  dataId?: string;
  /** Callback pentru actualizarea badge-ului în părinte */
  onStatusChange: (text: string, variant: Variant) => void;
}

function formatVerdict(v: unknown): { text: string; variant: Variant } {
  if (typeof v === "string") {
    switch (v) {
      case "match_found":
        return { text: "Issues Detected", variant: "danger" };
      case "match_found_low":
      case "minor_match":
        return { text: "Minor Issues Detected", variant: "warning" };
      case "no_match":
      case "no_matched_data":
      default:
        return { text: "No Issues Detected", variant: "success" };
    }
  }
  const n = typeof v === "number" ? v : 0;
  if (n >= 2) return { text: "Issues Detected", variant: "danger" };
  if (n === 1) return { text: "Minor Issues Detected", variant: "warning" };
  return { text: "No Issues Detected", variant: "success" };
}

const ProactiveDLP: React.FC<ProactiveDLPProps> = ({
  dataId,
  onStatusChange,
}) => {
  const [items, setItems] = useState<DLPItemCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [badgeText, setBadgeText] = useState<string>("Loading...");
  const [badgeVariant, setBadgeVariant] = useState<Variant>("warning");

  // Ref pentru callback stabil
  const callbackRef = useRef(onStatusChange);
  useEffect(() => {
    callbackRef.current = onStatusChange;
  }, [onStatusChange]);

  // Fetch DLP doar la schimbarea dataId
  useEffect(() => {
    if (!dataId) return;
    setLoading(true);
    setError(null);

    axios
      .get<any>(`/file/${dataId}/dlp`)
      .then(({ data }) => {
        const verdict = data.dlp_info?.verdict;
        const { text, variant } = formatVerdict(verdict);
        setBadgeText(text);
        setBadgeVariant(variant);
        callbackRef.current(text, variant);

        const hits = data.dlp_info?.hits || {};
        const arr: DLPItemCardProps[] = Object.entries(defaultLabels).map(
          ([uiId, label]) => {
            const apiKey = Object.entries(apiKeyToUiId).find(
              ([, id]) => id === uiId
            )?.[0];
            const info = apiKey ? hits[apiKey] : undefined;
            const count = info?.hits?.length ?? 0;
            const severity =
              info?.hits?.reduce(
                (max: number, h: any) => Math.max(max, h.severity || 1),
                0
              ) ?? (count > 0 ? 1 : 0);
            return { id: uiId, label, icon: iconMap[uiId], count, severity };
          }
        );
        setItems(arr);
      })
      .catch((err) => {
        console.error("DLP error:", err);
        const msg =
          err.response?.data?.message || err.message || "Error loading DLP";
        setError(msg);
        setBadgeText(msg);
        setBadgeVariant("danger");
        callbackRef.current(msg, "danger");
      })
      .finally(() => setLoading(false));
  }, [dataId]);

  return (
    <SectionCard
      id="proactive-dlp-card"
      title="Proactive DLP"
      badgeText={badgeText}
      badgeVariant={badgeVariant}
      infoTooltip="This section scans for sensitive data in your document"
    >
      <div>
        {loading && <div>Loading DLP results…</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {!loading && !error && dataId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <DLPItemCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default ProactiveDLP;
