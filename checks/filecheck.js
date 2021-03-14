const fs = require('fs');

function checkFileExistence(pathToFile) {
    try {
        fs.accessSync(pathToFile, fs.constants.F_OK);
        return true;
    } catch (e) {
        console.error(pathToFile);
        return false;
    }
}

module.exports.checkFileExistence = checkFileExistence;
