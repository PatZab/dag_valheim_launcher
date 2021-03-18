// const exec = require('child_process').execSync();
const {spawn} = require('child_process')

const launchValheim = (vhInstallDir) => {
    let vhExePath = `${vhInstallDir}\\valheim.exe`;
    console.log("Starting game: " + vhExePath);
    spawn(vhExePath, {
        detached: true
    });
};

module.exports = {launchValheim}
