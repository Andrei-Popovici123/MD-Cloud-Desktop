import React, { useEffect, useState } from "react";
import SectionCard from "./SectionCard";
import { ExternalLink } from "lucide-react";
import illustration from "../assets/deepcdr-illustration.png";
import { fetchDeepCdr } from "../services/api";

export type Variant = "success" | "warning" | "danger";

export interface DeepCDRCardProps {
  dataId?: string;
  /**
   * Callback apelat când se schimbă statusul badge-ului
   * @param text - textul badge-ului (ex. "Sanitization In Progress")
   * @param variant - "success" | "warning" | "danger"
   */
  onStatusChange: (text: string, variant: Variant) => void;
}

interface CdrRow {
  object: string;
  action: string;
}

interface DeepCdrResponse {
  sanitized: {
    result: string;
    file_path: string;
    progress_percentage: number;
  };
  process_info: any;
}

export const DeepCDRCard: React.FC<DeepCDRCardProps> = ({
  dataId,
  onStatusChange,
}) => {
  const [rows, setRows] = useState<CdrRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setRows([]);
    setDownloadLink("");
    setProgress(0);

    if (!dataId) {
      setError("Data ID is unavailable. Awaiting upload completion.");
      setLoading(false);
      return;
    }

    fetchDeepCdr(dataId)
      .then((response) => {
        const { sanitized, process_info }: DeepCdrResponse = response.data;
        const pct = sanitized.progress_percentage;
        setProgress(pct);
        setDownloadLink(sanitized.file_path);

        const details =
          process_info.post_processing?.sanitization_details?.details;
        if (Array.isArray(details) && details.length > 0) {
          setRows(
            details.map((d: any) => ({
              object: d.object_name || "Unknown Object",
              action: d.action || "Processed",
            }))
          );
        } else {
          const defaultObjects = [
            "Custom XML",
            "External Image",
            "Hyperlink",
            "Image",
          ];
          setRows(
            defaultObjects.map((obj) => ({
              object: obj,
              action: "Not Present",
            }))
          );
        }
      })
      .catch((err: any) => {
        console.error(err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load sanitization data";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [dataId]);

  const badgeText = loading
    ? "Sanitization In Progress"
    : error
    ? "Error"
    : progress === 100
    ? "Sanitization Complete"
    : "Sanitization Available";

  const badgeVariant: Variant = loading
    ? "warning"
    : error
    ? "danger"
    : "success";

  useEffect(() => {
    onStatusChange(badgeText, badgeVariant);
  }, [badgeText, badgeVariant, onStatusChange]);

  return (
    <SectionCard
      id="deep-cdr-card"
      title="Deep CDR™ Regeneration"
      infoTooltip="Files are sanitized by removing unsupported objects and regenerating safe formats."
      badgeText={badgeText}
      badgeVariant={badgeVariant}
    >
      <div className="relative overflow-hidden">
        {!loading && !error && (
          <div className="absolute top-6 right-6 flex items-center space-x-2">
            <a href={downloadLink} target="_blank" rel="noopener noreferrer">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-300 hover:from-blue-600 hover:to-blue-400 text-white text-sm font-medium rounded-lg">
                Download Sanitized Version
              </button>
            </a>
            <ExternalLink className="w-5 h-5 text-gray-400 hover:text-white" />
          </div>
        )}

        <h5 className="text-gray-300 text-sm mb-5">After Data Sanitization</h5>

        <div className="flex items-center">
          {/* Tabel rezultate */}
          <div className="flex-1 overflow-auto pr-8">
            <table className="w-full text-left text-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="pb-2">Object</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.object} className="border-t border-gray-700">
                    <td className="py-3">{row.object}</td>
                    <td className="py-3">
                      <span className="inline-block px-2 py-1 text-xs text-white bg-gray-600 rounded">
                        {row.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ilustrație centrată vertical */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <img
              src={illustration}
              alt="Document sanitization illustration"
              className="w-48 h-48 opacity-20"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default DeepCDRCard;
