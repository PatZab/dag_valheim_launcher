const fs = require('fs');
// const {checkFileExistence} = require('../checks/file-check');

const writeInstallPath = (appDataPath, pathToValheimDir) => {
    let pathToFile = `${appDataPath}\\valheim_install_dir.txt`
    if (pathToValheimDir) {
        try {
            fs.writeFileSync(pathToFile, pathToValheimDir);
        } catch (e) {
            console.error(e);
        }
    } else {
        return
    }
};

const readInstallPath = appDataPath => {
    let pathToFile = `${appDataPath}\\valheim_install_dir.txt`
    try {
        let pathToValheimDir = fs.readFileSync(pathToFile);
        console.log(pathToValheimDir);
    } catch (e) {
        console.error(e);
    }

};

module.exports = {writeInstallPath, readInstallPath};

