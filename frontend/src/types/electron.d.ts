export {};

declare global {
  interface Window {
    electronAPI?: {
      onFileToUpload: (callback: (filePath: string) => void) => void;
    };
  }
}