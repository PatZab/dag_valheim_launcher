// Modules
const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const {checkInstallPathFile, openInstallPath, getInstallPath} = require('./directory-actions/vh-install-dir');
const {
    checkModsVersion,
    getInstalledModsVersion,
    getLatestModsRelease,
    writeVersionToFile
} = require('./updater/mods/mods-version');
const {downloadLatestMods} = require('./updater/mods/mods-downloader');
const {launchValheim} = require('./launcher/game-launcher');
const {getAppVersion} = require('./updater/app/app-version')
const updater = require('./updater/app/updater');

const appDataPath = app.getPath('userData');
const homePath = app.getPath('home');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let installedModsVersion;
let latestModsRelease;
let vhInstallDir;

// Create a new BrowserWindow when `app` is ready
async function createWindow() {

    //Check for app updates after 1 second
    updater()

    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
        // alwaysOnTop: true,
        resizable: false,
        icon: ".\\build\\icon.ico",
        frame: false
    })

    const contents = mainWindow.webContents;

    console.log("Main window created!")

    // Load index.html into the new BrowserWindow
    // DO NOT SET AWAIT!!!!!!!!!
    mainWindow.loadFile('index.html')

    // Open DevTools - Remove for PRODUCTION!
    // contents.openDevTools();

    console.log(app.getLocale())

    contents.on('did-finish-load', async () => {

        console.log("Did finish load!")

        let vhInstallDirCheckValue = checkInstallPathFile(appDataPath);

        if (!vhInstallDirCheckValue) {
            console.log("Prompt: Set Valheim Dir!");
            const options = ["Set Valheim Install Directory"];
            await dialog.showMessageBox(mainWindow, {
                title: "No Install Directory Set!",
                message: "Please set the Valheim install directory!",
                detail: "Example: C:\\Program Files (x86)\\Steam\\steamapps\\common\\Valheim",
                buttons: options
            });
            await openInstallPath(mainWindow, homePath);
        }

        vhInstallDir = getInstallPath();

        installedModsVersion = getInstalledModsVersion(vhInstallDir);
        contents.send("display-mods-version", installedModsVersion);

        latestModsRelease = await getLatestModsRelease();
        contents.send("display-latest-release", latestModsRelease);

        contents.send("display-app-version", getAppVersion());

        let modsCheckValue = checkModsVersion(installedModsVersion, latestModsRelease);

        if (!modsCheckValue) {
            console.log("Latest Mods have to be dowloaded and installed!");
            contents.send("enable-update-button");
        } else {
            contents.send("enable-launch-button", "Launch button enabled!");
        }

        console.log("Everything is up-to-date!");
        console.log("Ready to launch Valheim!")

        contents.send("display-latest-release", latestModsRelease);
        contents.send("display-vh-dir", vhInstallDir);

    })

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null
    })

}

ipcMain.on("valheim-path-set", (e) => {
    openInstallPath(mainWindow, homePath).then(() => {
        mainWindow.webContents.send("display-vh-dir", getInstallPath())
    });
});

ipcMain.on('launch-game', (event => {
    launchValheim(getInstallPath());
    setTimeout(() => {
        app.quit();
    }, 3000);
}));

ipcMain.on('update-mods', event => {
    downloadLatestMods(mainWindow, latestModsRelease, vhInstallDir).then(() => {
        writeVersionToFile(latestModsRelease);
        mainWindow.webContents.send("enable-launch-button", "Launch button enabled!");
        mainWindow.webContents.send("display-mods-version", getInstalledModsVersion(vhInstallDir));
    });
});

ipcMain.on('quit-app', event => {
    app.quit();
});

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