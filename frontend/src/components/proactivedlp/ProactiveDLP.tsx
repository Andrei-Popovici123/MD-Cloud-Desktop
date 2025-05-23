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

export type Variant = "success" | "warning" | "danger" | "neutral";

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
  dataId?: string;
  onStatusChange: (text: string, variant: Variant) => void;
}

const ProactiveDLP: React.FC<ProactiveDLPProps> = ({
  dataId,
  onStatusChange,
}) => {
  const [canRedact, setCanRedact] = useState<boolean>(false);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [items, setItems] = useState<DLPItemCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [badgeText, setBadgeText] = useState<string>("Loading...");
  const [badgeVariant, setBadgeVariant] = useState<Variant>("neutral");
  const callbackRef = useRef(onStatusChange);
  useEffect(() => {
    callbackRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    if (!dataId) return;
    setLoading(true);
    setError(null);
    setItems([]);
    setBadgeText("Loading...");
    setBadgeVariant("neutral");

    axios
      .get<any>(`/file/${dataId}/dlp`)
      .then(({ data }) => {
        const dlp = data.dlp_info || {};
        const hitsObj = dlp.hits || {};

        let totalHits = 0;
        const severities: number[] = [];
        Object.values(hitsObj).forEach((info: any) => {
          const arr = info.hits || [];
          totalHits += arr.length;
          arr.forEach((h: any) => severities.push(h.severity ?? 0));
        });
        const maxSeverity = severities.length ? Math.max(...severities) : 0;

        const allHits = Object.values(hitsObj).flatMap(
          (info: any) => info.hits || []
        );
        const allowRedact =
          allHits.length > 0 && allHits.every((h: any) => h.tryRedact);
        setCanRedact(allowRedact);

        setDownloadLink(`/file/${dataId}/dlp/redacted`);
        severities.length ? Math.max(...severities) : 0;

        // Determine badge based on API verdict or hits
        let text: string;
        let variant: Variant;
        if (totalHits > 0) {
          if (maxSeverity === 1 && severities.every((s) => s <= 1)) {
            text = "Minor Issues Detected";
            variant = "warning";
          } else {
            // Otherwise treat as matched data
            text = "Found Matched Data";
            variant = "danger";
          }
        } else {
          text = "No Issues Detected";
          variant = "success";
        }
        setBadgeText(text);
        setBadgeVariant(variant);
        callbackRef.current(text, variant);

        const arr = Object.entries(defaultLabels).map(([uiId, label]) => {
          const apiKey = Object.entries(apiKeyToUiId).find(
            ([, id]) => id === uiId
          )?.[0];
          const info = apiKey ? (hitsObj as any)[apiKey] : undefined;
          const count = (info?.hits || []).length;
          const highestSeverity = (info?.hits || []).reduce(
            (max: number, h: any) => Math.max(max, h.severity ?? 0),
            0
          );
          let itemSeverity = highestSeverity;
          // If no severity but there are hits, color based on overall badge variant
          if (itemSeverity === 0 && count > 0) {
            itemSeverity =
              variant === "danger" ? 2 : variant === "warning" ? 1 : 0;
          }
          return {
            id: uiId,
            label,
            icon: iconMap[uiId],
            count,
            severity: itemSeverity,
          };
        });
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
      .finally(() => {
        setLoading(false);
      });
  }, [dataId]);

  return (
    <SectionCard
      id="proactive-dlp-card"
      title="Proactive DLP"
      badgeText={badgeText}
      badgeVariant={badgeVariant}
      infoTooltip="This section scans for sensitive data in your document"
      headerRight={
        <div className="flex items-center space-x-2">
          <button
            disabled={!canRedact || loading || !!error}
            className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none 
              ${
                canRedact && !loading && !error
                  ? "bg-gradient-to-r from-blue-500 to-blue-300 hover:from-blue-600 hover:to-blue-400 text-white"
                  : "bg-gray-500 text-white cursor-not-allowed"
              }
            `}
            onClick={() => {
              if (downloadLink) window.open(downloadLink, "_blank");
            }}
          >
            Download Redacted Version
          </button>
          <ExternalLinkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
        </div>
      }
    >
      {loading && <div>Loading DLP results…</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && dataId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <DLPItemCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default ProactiveDLP;
