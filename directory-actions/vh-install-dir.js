const fs = require('fs');
const {dialog} = require('electron');
const {checkFileExistence} = require('../checks/file-existing-check')
const dirFileName = "valheim_install_dir.txt";
let dirFilePath;

const checkInstallPathFile = (appDataPath) => {
    dirFilePath = `${appDataPath}\\${dirFileName}`;
    return checkFileExistence(dirFilePath);
};

const setInstallPath = (pathToValheimDir) => {

    if (pathToValheimDir) {
        try {
            fs.writeFileSync(dirFilePath, pathToValheimDir);
        } catch (e) {
            console.error(e);
        }
    }
};

const getInstallPath = () => {
    try {
        return fs.readFileSync(dirFilePath).toString();

    } catch (e) {
        console.error(e);
    }
};

const openInstallPath = async (mainWindow, homePath) => {

    console.log("Opening dialog");

    let result = await dialog.showOpenDialog(mainWindow, {
        defaultPath: homePath,
        properties: ["openDirectory"]
    })


    if (!result.canceled) {
        setInstallPath(result.filePaths[0]);
        // return getInstallPath()
    }
};
module.exports = {checkInstallPathFile, setInstallPath, getInstallPath, openInstallPath};

