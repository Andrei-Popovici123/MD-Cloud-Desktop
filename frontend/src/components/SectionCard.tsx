import React from "react";

export interface SectionCardProps {
  id?: string;
  title: string;
  badgeText: string;
  badgeVariant?: "success" | "warning" | "danger";
  infoTooltip?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  id,
  title,
  badgeText,
  badgeVariant = "success",
  infoTooltip,
  children,
}) => {
  // alege clasa de fundal pe baza variantei
  const badgeBg =
    badgeVariant === "danger"
      ? "bg-red-600"
      : badgeVariant === "warning"
      ? "bg-yellow-500"
      : "bg-green-600";

  return (
    <div id={id} className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-2">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        {infoTooltip && (
          <span className="text-gray-400 cursor-help" title={infoTooltip}>
            ⓘ
          </span>
        )}
      </div>

      <div className="mb-4">
        <span className={`${badgeBg} text-white text-sm px-2 py-1 rounded`}>
          {badgeText}
        </span>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default SectionCard;
