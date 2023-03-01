const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("fileManager", {
  openFile: () => ipcRenderer.invoke("openFile"),
  createFile: (args) => ipcRenderer.invoke("createFile", args),
});
