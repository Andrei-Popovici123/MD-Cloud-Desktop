import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SidebarNav } from "../SidebarNav";
import { ProactiveDLP } from "./ProactiveDLP";
import { DLPItemCardProps } from "./DLPItemCard";
import MultiScanning from "../MultiScanning";
import { DeepCDRCard } from "../DeepCDRCard";

export const ProactiveDLPPage: React.FC = () => {
  // Extrage ID-ul fișierului din URL (dacă există)
  const { dataId: paramDataId } = useParams<{ dataId: string }>();
  const [dataId, setDataId] = useState<string | undefined>(paramDataId);
  const navigate = useNavigate();
  const [items, setItems] = useState<DLPItemCardProps[]>([]);

  // Handler pentru upload de fișier
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);

    try {
      const response = await axios.post<{ dataId: string }>("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const id = response.data.dataId;
      setDataId(id);
      // Navighează la ruta cu parametru pentru a păstra în URL
      navigate(`/proactive-dlp/${id}`);
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  useEffect(() => {
    // Fetch Proactive DLP items (mock sau real)
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
        { id: "govt-ids", label: "Government IDs", count: 1, icon: undefined },
      ]);
    }, 500);
  }, []);

  return (
    <div className="bg-black min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <SidebarNav />

      <main className="p-6 overflow-auto space-y-8">
        {/* Upload Component */}
        <div>
          <label className="text-white mb-2 block">
            Încarcă un fișier pentru scanare:
          </label>
          <input type="file" accept="*" onChange={handleUpload} />
        </div>

        {/* Multi-Scanning Section */}
        <div>
          <MultiScanning dataId={dataId} />
        </div>

        {/* Proactive DLP Section */}
        <div>
          <ProactiveDLP dataId={dataId} />
        </div>

        {/* Deep CDR Section */}
        <section>
          <DeepCDRCard dataId={dataId} />
        </section>
      </main>
    </div>
  );
};
