import { useState } from "react";
import FileUploader from "./components/FileUploader";
import MultiScanning from "./components/MultiScanning";
import ProactiveDLPPage from "./components/proactivedlp/ProactiveDLPPage";
import { Routes, Route } from "react-router-dom";
import { DeepCDRCard } from "./components/DeepCDRCard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FileUploader />} />
      {/* <Route path="/file/:dataId/multiscan" element={<MultiScanning />} />
      <Route path="/file/:dataId/cdr" element={<DeepCDRCard />} /> */}
      <Route path="/proactive-dlp/:dataId?" element={<ProactiveDLPPage />} />
    </Routes>
  );
}
