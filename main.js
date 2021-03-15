// Modules
const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const {checkInstallPathFile, openInstallPath, getInstallPath} = require('./directory-actions/vh-install-dir');
const {checkModsVersion, getInstalledModsVersion} = require('./updater/mods/mods-version');
const {launchValheim} = require('./launcher/game-launcher');

const appDataPath = app.getPath('userData');
const homePath = app.getPath('home');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {

    let winState = windowStateKeeper({
        defaultHeight: 800,
        defaultWidth: 1000,
    })

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

    const contents = mainWindow.webContents;

    console.log("Main window created!")

    // Load index.html into the new BrowserWindow
    mainWindow.loadFile('index.html')

    winState.manage(mainWindow);

    // Open DevTools - Remove for PRODUCTION!
    contents.openDevTools();

    const installMods = async () => {
        if (!checkInstallPathFile(appDataPath)) {
            const options = ['Set Valheim Install Directory']
            await dialog.showMessageBox(mainWindow, {
                title: "No Install Directory Set!",
                message: "Please set the Valheim install directory!",
                detail: "Example: C:\\Program Files (x86)\\Steam\\steamapps\\common\\Valheim",
                buttons: options
            });
            console.log("Directory Notification.");
            await openInstallPath(mainWindow, homePath);
        }
        await checkModsVersion(appDataPath, getInstallPath());
        console.log("Yeah")
    };

    contents.on('did-finish-load', () => {
        console.log("Did finish load!")
        installMods().then(() => {
            console.log("Everything is up-to-date!");
            console.log("Ready to launch Valheim!")
            contents.send("enable-launch-button", "Launch button enabled!");
            contents.send("display-mods-version", getInstalledModsVersion(appDataPath));
        });
    })

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null
    })

}

ipcMain.on("valheim-path-set", (e) => {
    openInstallPath(mainWindow, homePath);
});

ipcMain.on('launch-game', (event => {
    launchValheim(getInstallPath());
    // app.quit();
}));

// Electron `app` is ready
app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})