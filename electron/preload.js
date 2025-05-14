const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
  onFileToUpload: (callback) => {
    ipcRenderer.on('file-to-upload', (_event, path) => {
      callback(path);
    });
  }
});