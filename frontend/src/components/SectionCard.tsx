import React from "react";

export interface SectionCardProps {
  id?: string;
  title: string;
  badgeText: string;
  badgeVariant?: "success" | "warning" | "danger" | "neutral";
  infoTooltip?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  id,
  title,
  badgeText,
  badgeVariant = "success",
  infoTooltip,
  headerRight,
  children,
}) => {
  const badgeBg =
    badgeVariant === "danger"
      ? "bg-red-600"
      : badgeVariant === "warning"
      ? "bg-yellow-500"
      : badgeVariant === "neutral"
      ? "bg-gray-500"
      : "bg-green-600";

  return (
    <div id={id} className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between items-start">
          {/* Left: title + badge */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h2 className="text-white text-xl font-bold">{title}</h2>
              {infoTooltip && (
                <span className="text-gray-400 cursor-help" title={infoTooltip}>
                  ⓘ
                </span>
              )}
            </div>
            <div className="mt-2">
              <span
                className={`${badgeBg} text-white text-sm px-2 py-1 rounded`}
              >
                {badgeText}
              </span>
            </div>
          </div>

          {/* Right: headerRight */}
          {headerRight && (
            <div className="border-l border-gray-700 pl-6 flex items-center">
              {headerRight}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

export default SectionCard;
