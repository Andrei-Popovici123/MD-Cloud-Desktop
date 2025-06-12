export { };

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
        removeAllListeners: (channel: string) => void;
        runMiddleware: (filePath: string) => Promise<Buffer>;
        onPythonExitCode: (callback: (code: number) => void) => void;
      };
    };
  }
}