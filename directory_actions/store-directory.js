const fs = require('fs');
const {checkFileExistence} = require('../checks/filecheck');

let pathToDirectoryFile;

function storeValheimInstallPath(pathToValheim) {
    if (checkFileExistence()) {

    }
}

function setPathToDirectoyfile(appDataPath, fileName) {
    pathToDirectoryFile = `${appDataPath}\\${fileName}`;
}