"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { GET_FILE, SAVE_FILE, LOAD_DIALOG, SAVE_DIALOG, ERROR_DIALOG } from "./utils/data/constants";
import XLSX from "xlsx";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 650,
    minWidth: 1200,
    minHeight: 650,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
    },
  });
  win.removeMenu();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Handle file get dialog
ipcMain.on(LOAD_DIALOG, (event) => {
  dialog
    .showOpenDialog({
      defaultPath: app.getPath("desktop"),
      filters: [{ name: "Data", extensions: ["csv", "xls", "xlsx"] }],
    })
    .then((result) => {
      if (!result.canceled) event.reply(GET_FILE, result.filePaths[0]);
    })
    .catch((err) => {
      dialog.showErrorBox("Failed to load file", err);
    });
});

// Handle file save dialog
ipcMain.on(SAVE_DIALOG, (event, book) => {
  dialog
    .showSaveDialog({
      filters: [{ name: "Excel Workbook", extensions: ["xlsx"] }, { name: "CVS UTF-8 (Comma delimited)", extensions: ["csv"] }, { name: "Excel 97-2003 Workbook", extensions: ["xls"] }],
    })
    .then((result) => {
      if (!result.canceled) {
        XLSX.writeFile(book, result.filePath);
        event.reply(SAVE_FILE);
      }
    })
    .catch((err) => {
      dialog.showErrorBox("Failed to save file", err);
    });
});

// Handle error dialog
ipcMain.on(ERROR_DIALOG, (e, value) => {
  const options = {
    type: "error",
    message: "Error message: \n" + value,
  };
  dialog.showMessageBox(null, options);
});



// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
