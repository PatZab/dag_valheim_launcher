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

const appDataPath = app.getPath('userData');
const homePath = app.getPath('home');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let installedModsVersion;
let latestModsRelease;
let vhInstallDir;

// Create a new BrowserWindow when `app` is ready
function createWindow() {

    // let winState = windowStateKeeper({
    //     defaultHeight: 200,
    //     defaultWidth: 100,
    // })

    mainWindow = new BrowserWindow({
        width: 450,/*winState.defaultWidth,*/
        height: 300,/*winState.defaultHeight,*/
        // x: winState.x,
        // y: winState.y,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
        alwaysOnTop: true,
        resizable: false,
        icon: ".\\build\\icon.ico"
    })

    const contents = mainWindow.webContents;

    console.log("Main window created!")

    // Load index.html into the new BrowserWindow
    mainWindow.loadFile('index.html')

    // winState.manage(mainWindow);

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

        installedModsVersion = getInstalledModsVersion(appDataPath);

        latestModsRelease = await getLatestModsRelease();

        let modsCheckValue = checkModsVersion(installedModsVersion, latestModsRelease);

        if (!modsCheckValue) {
            console.log("Latest Mods have to be dowloaded and installed!")
            // await downloadMods(vhInstallDir, latestModsRelease);
            await downloadLatestMods(mainWindow, latestModsRelease, vhInstallDir);
            writeVersionToFile(latestModsRelease);
        }

        console.log("Everything is up-to-date!");

        console.log("Ready to launch Valheim!")

        contents.send("enable-launch-button", "Launch button enabled!");
        contents.send("display-mods-version", getInstalledModsVersion(appDataPath));
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
        mainWindow.webContents.send("display-vh-dir", vhInstallDir)
        mainWindow.reload()
    });
});

ipcMain.on('launch-game', (event => {
    launchValheim(getInstallPath());
    setTimeout(() => {
        mainWindow.minimize();
    }, 2000);
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