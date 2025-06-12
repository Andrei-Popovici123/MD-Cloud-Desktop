import axios from "axios";
import React, { DragEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.PORT || "http://localhost:3000";
axios.defaults.withCredentials = true;

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

const FileUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dataId, setDataId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (dataId) {
      setShowModal(true);
      interval = setInterval(async () => {
        try {
          const { data } = await axios.get(`/file/${dataId}`);
          const prog = data.process_info?.progress_percentage ?? 0;
          setProgress(prog);
          if (prog >= 100) {
            clearInterval(interval);
            setShowModal(false);
            navigate(`/proactive-dlp/${dataId}`);
          }
        } catch (error) {
          console.error("Error polling status:", error);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dataId]);

  useEffect(() => {

    window.electron.ipcRenderer.on('context-binary-upload', async (filePath) => {
      console.log("[frontend] Received path via IPC again:", filePath);
      try {
        const buffer = await window.electron.ipcRenderer.runMiddleware(filePath);

        const uint8 = new Uint8Array(buffer);

        let headerEnd = -1;
        for (let i = 0; i < uint8.length - 1; i++) {
          if (uint8[i] === 0x0A && uint8[i + 1] === 0x0A) {
            headerEnd = i;
            break;
          }
        }

        if (headerEnd === -1) {
          console.error('[frontend] No metadata delimiter (\\n\\n) found in buffer!');
          return;
        }

        const metadataText = new TextDecoder('utf-8').decode(uint8.slice(0, headerEnd));
        const metadata = JSON.parse(metadataText);

        const binary = uint8.slice(headerEnd + 2);

        const blob = new Blob([binary], { type: metadata.mimetype })

        const file = new File([blob], metadata.name, {
          type: metadata.mimetype,
          lastModified: metadata.lastModifie || Date.now()
        });
        await handleUpload(file);

      } catch (error) {
        console.error(' Error calling runMiddleware:', error);
      }
    });
    window.electron.ipcRenderer.onPythonExitCode((code) => {
      if (code === 2) {
        setUploadStatus("File is too big. Maximum size is 4 MB.");
      }
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('context-binary-upload');
      // window.electron.ipcRenderer.removeAllListeners('python-exit-code');
    };
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  const validateAndUpload = (file: File) => {
    setSelectedFile(file);
    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus("File is too big. Maximum size is 4 MB.");
    } else {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadStatus(null);
    setDataId(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      const data = response.data;
      if (data.success && data.dataId) {
        setDataId(data.dataId);
      } else if (data.success) {
        window.location.href = "/proactive-dlp";
      } else {
        setUploadStatus(`Upload failed: ${data.error || "Unknown error."}`);
      }
    } catch (err: any) {
      const resp = err.response;
      if (resp?.status === 413 || err.code === "ERR_BAD_REQUEST") {
        setUploadStatus("File is too big. Maximum size is 4 MB.");
      } else if (resp?.status === 401) {
        setUploadStatus("Unauthorized: please log in and try again.");
      } else {
        setUploadStatus(
          resp?.data?.error || "An error occurred during upload."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-gray-800 flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-2">
          <h1 className="text-white text-lg font-semibold">
            MetaDefender
          </h1>
          <span className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded">
            MD Desktop
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 pt-24">
        <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Trust no File</h1>
          <div
            className="border-2 border-dashed border-gray-500 rounded-md p-8 text-center cursor-pointer transition-colors hover:border-white bg-gray-700"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="mb-2 text-lg font-medium">
              Drag & Drop your file here
            </p>
            <p className="text-sm text-gray-300">or</p>
            <div className="mt-4">
              <label
                htmlFor="fileInput"
                className="px-4 py-2 text-sm font-medium rounded-lg focus:outline-none bg-gradient-to-r from-blue-500 to-blue-300 hover:from-blue-600 hover:to-blue-400 text-white"
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
            <p className="text-sm text-gray-300 mt-4">
              Selected File: {selectedFile.name}
            </p>
          )}
          {isUploading ? (
            <p className="text-yellow-400 mt-2">Uploading...</p>
          ) : uploadStatus ? (
            <p className="mt-2" style={{ color: "rgb(0, 138, 0)" }}>
              {uploadStatus}
            </p>
          ) : null}
        </div>

        {/* Processing Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
            <div className="bg-black rounded-lg shadow-xl w-[90vw] h-[90vh] overflow-auto">
              <div className="flex justify-end p-4">
                <button
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>
              <div
                className="bg-gray-800 text-white p-6 flex flex-col items-center justify-center"
                style={{ height: "calc(80vh - 4rem)" }}
              >
                <div className="w-12 h-12 border-4 border-t-blue-500 border-white rounded-full animate-spin" />
                <p className="mt-4 text-lg font-medium">
                  Processing... {progress}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUploader;
