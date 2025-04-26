// pages/ProactiveDLPPage.tsx
import React, { useEffect, useState } from "react";
import { SidebarNav } from "../SidebarNav";
import { ProactiveDLP } from "./ProactiveDLP";
import { DLPItemCardProps } from "./DLPItemCard";

export const ProactiveDLPPage: React.FC = () => {
  const [items, setItems] = useState<DLPItemCardProps[]>([]);

  useEffect(() => {
    // fetch("/api/proactive-dlp")
    //   .then(res => res.json())
    //   .then(setItems);

    // Mock:
    setTimeout(() => {
      setItems([
        {
          id: "credit-card",
          label: "Credit Card Number",
          count: 3,
          icon: undefined,
        },
        {
          id: "ssn",
          label: "Social Security Number",
          count: 0,
          icon: undefined,
        },
        {
          id: "govt-ids",
          label: "Government IDs",
          count: 1,
          icon: undefined,
        },
      ]);
    }, 500);
  }, []);

  return (
    <div className="bg-black min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r border-gray-700 p-4">
        <SidebarNav />
      </aside>

      <main className="p-6 overflow-auto">
        <ProactiveDLP items={items} />
      </main>
    </div>
  );
};
