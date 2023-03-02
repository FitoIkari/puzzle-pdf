const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { dialogManager, saveDialog } = require("./scripts/dialog.js");
const path = require("path");
const url = require("url");
const { menuTemplate } = require("./scripts/MainMenu.js");
const { pdfEngine } = require("../src/scripts/engine.js");

if (process.env.NODE_ENV !== "production")
  require("electron-reload")(__dirname.slice(0, -4), {
    electron: path.join(
      __dirname.slice(0, -4),
      "node_modules",
      ".bin",
      "electron"
    ),
  });

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "scripts", "preload.js"),
    },
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  ipcMain.handle("openFile", async (ev) => {
    const res = await dialogManager();
    if (res.canceled) return { filePages: null, title: null };

    const title = await pdfEngine.openFile(res.filePaths[0]);
    return { filePages: pdfEngine.getFile(title).pdfDoc.getPageCount(), title };
  });

  ipcMain.handle("createFile", async (ev, args) => {
    const { title, newFilePages } = args;
    const defaultPath = path.join(
      __dirname,
      "..",
      "createdFiles",
      `${title}_${title === "New File" ? new Date().getMilliseconds() : ""}.pdf`
    );

    const res = await saveDialog(defaultPath);

    if (!res.canceled)
      await pdfEngine.createNewFile(newFilePages, res.filePath);
  });
});
