const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { dialogManager } = require("./scripts/dialog.js");
const path = require("path");
const url = require("url");
const { menuTemplate } = require("./scripts/MainMenu.js");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

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
    const title = res.filePaths[0].split("\\").slice(-1)[0].replace(".pdf", "");
    let pdfBytes = fs.readFileSync(res.filePaths[0]);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    return { filePages: pdfDoc.getPageCount(), title };
  });
});

exports.mainWindow = mainWindow;
