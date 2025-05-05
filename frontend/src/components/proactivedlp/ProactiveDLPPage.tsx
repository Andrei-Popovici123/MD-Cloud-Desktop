import React, { useEffect, useState } from "react";
import { SidebarNav } from "../SidebarNav";
import { ProactiveDLP } from "./ProactiveDLP";
import { DLPItemCardProps } from "./DLPItemCard";
import MultiScanning from "../MultiScanning";
import { DeepCDRCard } from "../DeepCDRCard";

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
    <div className="bg-black min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
      {/* <aside className="border-r border-gray-700 p-4"> */}
      <SidebarNav />
      {/* </aside> */}

      <main className="p-6 overflow-auto space-y-8">
        {/* Multi-Scanning Section */}
        <div>
          {/* <h2 className="text-white text-xl mb-4">Multi-Engine Scanning</h2> */}
          <MultiScanning />
        </div>

        {/* Proactive DLP Section */}
        <div>
          {/* <h2 className="text-white text-xl mb-4">Proactive DLP</h2> */}
          <ProactiveDLP items={items} />
        </div>
        {/* Deep CDR Section */}
        <section>
          <DeepCDRCard />
        </section>
      </main>
    </div>
  );
};
