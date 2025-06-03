const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, listener) => {
      const validChannels = ['context-binary-upload'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (_event, ...args) => listener(...args));
      }
    },
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    runMiddleware: async (filePath) => {
      
      const buffer = await ipcRenderer.invoke('run-middleware', filePath);

      return buffer;
    },
  }
});