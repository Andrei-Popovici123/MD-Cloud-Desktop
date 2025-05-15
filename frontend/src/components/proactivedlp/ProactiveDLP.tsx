import React, { useEffect, useState } from "react";
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

// Etichete implicite pentru UI
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

// Mapare cheie API → id UI
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

// Icon-uri pentru fiecare categorie
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
}

export const ProactiveDLP: React.FC<ProactiveDLPProps> = ({ dataId }) => {
  const [items, setItems] = useState<DLPItemCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalSev, setGlobalSev] = useState(0);

  useEffect(() => {
    if (!dataId) {
      setItems([]);
      setGlobalSev(0);
      return;
    }
    setLoading(true);
    setError(null);

    axios
      .get<any>(`/file/${dataId}/dlp`)
      .then(({ data }) => {
        // data.dlp_info.verdict holds global severity
        const verdict = data.dlp_info?.verdict;
        const parsedGlobal = typeof verdict === "number" ? verdict : 0;
        setGlobalSev(parsedGlobal);

        const hits = data.dlp_info?.hits || {};
        const arr: DLPItemCardProps[] = Object.entries(defaultLabels).map(
          ([uiId, label]) => {
            const apiKey = Object.entries(apiKeyToUiId).find(
              ([, id]) => id === uiId
            )?.[0];
            const info = apiKey ? hits[apiKey] : undefined;
            const count = info?.hits?.length ?? 0;
            // if response has severity per hit, use max, otherwise use default 1 if count>0
            const sev =
              info?.hits?.reduce(
                (m: number, h: any) => Math.max(m, h.severity || 1),
                0
              ) ?? (count > 0 ? 1 : 0);
            return {
              id: uiId,
              label: info?.display_name ?? label,
              icon: iconMap[uiId],
              count,
              severity: sev,
            };
          }
        );
        setItems(arr);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Eroare la încărcarea DLP");
      })
      .finally(() => setLoading(false));
  }, [dataId]);

  // Decide textul pentru badge-ul principal
  const badgeText = loading
    ? "Loading..."
    : error
    ? "Error"
    : globalSev >= 2
    ? "Issues Detected"
    : globalSev === 1
    ? "Minor Issues Detected"
    : "No Issues Detected";

  return (
    <SectionCard
      title="Proactive DLP"
      badgeText={badgeText}
      infoTooltip="This section scans for sensitive data in your document"
    >
      <div className="absolute top-6 right-6 flex items-center space-x-2">
        <button
          disabled={loading || !!error}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded"
        >
          Download Redacted Version
        </button>
        <ExternalLinkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
      </div>

      <div className="mt-4">
        {!dataId && (
          <div className="text-gray-400">Încarcă mai întâi un fișier.</div>
        )}
        {loading && <div>Se încarcă DLP…</div>}
        {error && <div className="text-red-500">Eroare: {error}</div>}
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
