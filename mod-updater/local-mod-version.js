const fs = require('fs');
const {checkFileExistence} = require("../checks/file-check");
let entirePathToVersion;

function getInstalledVersion(appDataPath) {

    entirePathToVersion = `${appDataPath}\\dag_version.txt`;
    if (checkFileExistence(entirePathToVersion)) {
        let installedVersion = fs.readFileSync(entirePathToVersion);
        return installedVersion.toString();
    } else {
        createVersionFile(entirePathToVersion);
        getInstalledVersion(appDataPath);
    }
}

function writeVersionToFile(latestVersion) {
    fs.writeFileSync(entirePathToVersion, latestVersion);
}

function createVersionFile(pathToVersionFile) {
    fs.writeFileSync(pathToVersionFile, "not installed");
}

module.exports = {getInstalledVersion, writeVersionToFile}
