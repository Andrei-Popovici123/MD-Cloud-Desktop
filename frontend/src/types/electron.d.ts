export {};

declare global {
  interface Window {
    electronAPI?: {
      onFileDropped: (callback: (filePath: string) => void) => void;
    };
  }
}