import React from "react";

export interface SectionCardProps {
  title: string;
  badgeText: string;
  badgeVariant?: "success" | "warning" | "danger";
  infoTooltip?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
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
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Titlul și tooltip */}
      <div className="flex items-center space-x-2 mb-2">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        {infoTooltip && (
          <span className="text-gray-400 cursor-help" title={infoTooltip}>
            ⓘ
          </span>
        )}
      </div>

      {/* Badge sub titlu */}
      <div className="mb-4">
        <span className={`${badgeBg} text-white text-sm px-2 py-1 rounded`}>
          {badgeText}
        </span>
      </div>

      {/* Conținutul secțiunii */}
      <div>{children}</div>
    </div>
  );
};

export default SectionCard;
