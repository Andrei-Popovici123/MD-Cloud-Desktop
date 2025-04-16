import React, { useState, DragEvent } from "react";

// Funcție mock ce simuleaza "upload-ul" fișierului la un server
const mockUploadFile = (
  file: File
): Promise<{ success: boolean; fileName: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, fileName: file.name });
    }, 1000);
  });
};

const FileUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  // Drag & Drop events
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    setUploadStatus(null);

    try {
      const response = await mockUploadFile(file);
      if (response.success) {
        setUploadStatus(`File "${response.fileName}" uploaded successfully!`);
      } else {
        setUploadStatus("File upload failed.");
      }
    } catch (error) {
      setUploadStatus("An error occurred while uploading the file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md w-full space-y-4">
        {/* Titlu */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Trust no File
        </h1>

        {/* Zona de Drag & Drop */}
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
    </div>
  );
};

export default FileUploader;
