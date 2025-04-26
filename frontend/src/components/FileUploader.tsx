import axios from "axios";
import React, { DragEvent, useState } from "react";
import MultiScanning from "./MultiScanning";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

const FileUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // --------------------------
  // Drag & Drop / File Input
  // --------------------------
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  const validateAndUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus("File is too big. Maximum size is 4 MB.");
      setSelectedFile(file);
    } else {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = response.data;

      if (data.success) {
        setUploadStatus(`File "${data.originalName}" uploaded successfully!`);
        setShowModal(true);
      } else {
        setUploadStatus(`Upload failed: ${data.error || "Unknown error."}`);
      }
    } catch (err: any) {
      const resp = err.response;
      if (resp?.status === 413 || err.code === "ERR_BAD_REQUEST") {
        setUploadStatus("File is too big. Maximum size is 4 MB.");
      } else {
        setUploadStatus(
          resp?.data?.error || "An error occurred while uploading the file."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Trust no File
        </h1>

        <div
          className="border-2 border-dashed border-gray-500 rounded-md p-6 text-center cursor-pointer
                     transition-colors hover:border-white"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className="mb-2">Drag &amp; Drop your file here</p>
          <p className="text-sm text-gray-400">or</p>
          <div className="mt-2">
            <label
              htmlFor="fileInput"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded cursor-pointer inline-block"
            >
              Add File
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        </div>

        {selectedFile && (
          <p className="text-sm text-gray-300">
            Selected File: {selectedFile.name}
          </p>
        )}
        {isUploading ? (
          <p className="text-yellow-400">Uploading...</p>
        ) : uploadStatus ? (
          <p className="text-green-400">{uploadStatus}</p>
        ) : null}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div
            className="bg-black rounded-lg shadow-xl
                    w-[90vw] h-[90vh]
                    overflow-auto"
          >
            <div className="flex justify-end p-4">
              <button
                className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            <div
              className="bg-gray-800 text-white p-6 overflow-auto"
              style={{ height: "calc(80vh - 4rem)" }}
            >
              <MultiScanning />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
