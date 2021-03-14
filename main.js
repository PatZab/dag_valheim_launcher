// Modules
const {app, BrowserWindow} = require('electron')
const path = require('path');
const versionCheck = require('./mod-updater/versioncheck')
const downloadMods = require('./mod-updater/moddownload');

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


    console.log("Creating Window!");
    mainWindow = new BrowserWindow({
        width: 1000, height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    // Load index.html into the new BrowserWindow
    mainWindow.loadFile('index.html')

    // Open DevTools - Remove for PRODUCTION!
    mainWindow.webContents.openDevTools();

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

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