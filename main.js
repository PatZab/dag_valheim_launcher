// Modules
const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const versionCheck = require('./mod-updater/version-check')
const downloadMods = require('./mod-updater/mod-download');
const {writeInstallPath} = require('./directory-actions/vh-install-dir');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// let appDataPath = app.getPath('userData');
// checkingFile(appDataPath);

async function startUp() {
    let modsUpToDate = await versionCheck(app.getPath('userData'));
    if (modsUpToDate) {
        createWindow();
    } else {
        await downloadMods();
        createWindow();
    }


}

// Create a new BrowserWindow when `app` is ready
function createWindow() {

    let winState = windowStateKeeper({
        defaultHeight: 800,
        defaultWidth: 1000,
    })

    console.log("Creating Window!");
    mainWindow = new BrowserWindow({
        width: winState.width,
        height: winState.height,
        x: winState.x,
        y: winState.y,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
        alwaysOnTop: true
    })

    // Load index.html into the new BrowserWindow
    mainWindow.loadFile('index.html')

    winState.manage(mainWindow);


    // dialog.showOpenDialog(mainWindow, {
    //     defaultPath: "C:\\",
    //     properties: ["openDirectory"]
    // }).then((result) => {
    //     console.log(result)
    // });
    // Open DevTools - Remove for PRODUCTION!
    mainWindow.webContents.openDevTools();


    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

ipcMain.on("valheim-path-set", (e) => {
    dialog.showOpenDialog(mainWindow, {
        defaultPath: "C:\\",
        properties: ["openDirectory"]
    }).then((result) => {
        console.log(result);
        if (!result.canceled) {
            writeInstallPath(app.getPath("userData"), result.filePaths[0]);
        }
    });
});

// Electron `app` is ready
app.on('ready', startUp);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})