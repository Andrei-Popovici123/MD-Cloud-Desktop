import { useState } from "react";
import FileUploader from "./components/FileUploader";
import MultiScanning from "./components/MultiScanning";
import { ProactiveDLPPage } from "./components/proactivedlp/ProactiveDLPPage";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FileUploader />} />
      <Route path="/proactive-dlp" element={<ProactiveDLPPage />} />
    </Routes>
  );
}
