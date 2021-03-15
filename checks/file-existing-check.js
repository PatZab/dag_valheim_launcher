const fs = require('fs');

const checkFileExistence = pathToFile => {
    try {
        fs.accessSync(pathToFile, fs.constants.F_OK);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

module.exports = {checkFileExistence};
