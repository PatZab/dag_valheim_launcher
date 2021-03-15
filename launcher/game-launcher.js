const exec = require('child_process').execFile;

const launchValheim = (vhInstallDir) => {
    let vhExePath = `${vhInstallDir}\\valheim.exe`;
    console.log("Starting game: " + vhExePath);
    exec(vhExePath);
};

module.exports = {launchValheim}
