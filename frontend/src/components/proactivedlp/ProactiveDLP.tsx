import React from "react";
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
} from "lucide-react";

export interface ProactiveDLPProps {
  items: DLPItemCardProps[];
}

const items = [
  {
    id: "credit-card",
    label: "Credit Card Number",
    icon: <CreditCard className="w-5 h-5 text-gray-300" />,
    count: 0,
  },
  {
    id: "ssn",
    label: "Social Security Number",
    icon: <User className="w-5 h-5 text-gray-300" />,
    count: 0,
  },
  {
    id: "govt-ids",
    label: "Government IDs",
    icon: <ShieldCheck className="w-5 h-5 text-gray-300" />,
    count: 0,
  },
  {
    id: "ipv4",
    label: "IPv4 address or subnet mask",
    icon: <Globe className="w-5 h-5 text-gray-300" />,
    count: 0,
  },
  {
    id: "inter-domain",
    label: "Classless Inter-Domain Routing",
    icon: <Router className="w-5 h-5 text-gray-300" />,
    count: 0,
  },
  {
    id: "adult-content",
    label: "Adult Content",
    icon: <AlertCircle className="w-5 h-5 text-gray-300" />,
    count: 0,
  },
  {
    id: "personal-id-docs",
    label: "Personal Identity Documents",
    icon: <FileText className="w-5 h-5 text-gray-300" />,
    count: 0,
  },
  {
    id: "secrets-text",
    label: "Secrets in Text Files",
    icon: <EyeOff className="w-5 h-5 text-gray-300" />,
    count: 0,
  },
  {
    id: "custom-regex",
    label: "Custom Regular Expressions (RegEx)",
    icon: <Code className="w-5 h-5 text-gray-300" />,
    count: 0,
  },
];

export const ProactiveDLP: React.FC<ProactiveDLPProps> = ({ items }) => {
  return (
    <SectionCard
      title="Proactive DLP"
      badgeText="No Issues Detected"
      infoTooltip="This section scans for sensitive data in your document"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <DLPItemCard
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            count={item.count}
          />
        ))}
      </div>
    </SectionCard>
  );
};
