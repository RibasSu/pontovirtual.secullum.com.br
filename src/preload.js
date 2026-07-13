const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pontoVirtualDesktop', {
  platform: process.platform,
  retryConnection: () => ipcRenderer.invoke('retry-connection')
});
