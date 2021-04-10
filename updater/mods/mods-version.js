const {Octokit} = require("@octokit/rest")
const fs = require('fs');
const {checkFileExistence} = require("../../checks/file-existing-check");
const {downloadMods} = require('./mods-downloader');

let entirePathToVersion;

const writeVersionToFile = (latestModsRelease) => {
    fs.writeFileSync(entirePathToVersion, latestModsRelease);
    console.log(`Written version ${latestModsRelease} to file`);
};

const createVersionFile = () => {
    let noVersion = "not installed";
    fs.writeFileSync(entirePathToVersion, noVersion);
    console.log("Created version file with value: " + noVersion);
};

const getInstalledModsVersion = vhInstallDir => {

    entirePathToVersion = `${vhInstallDir}\\dag_mods_version.txt`;
    if (checkFileExistence(entirePathToVersion)) {
        let installedVersion = fs.readFileSync(entirePathToVersion);
        console.log("Installed version: " + installedVersion.toString());
        return installedVersion.toString();
    } else {
        createVersionFile();
        getInstalledModsVersion(vhInstallDir);
    }
};

const checkModsVersion = (installedModsVersion, latestModsRelease) => {
    if (installedModsVersion < latestModsRelease) {
        console.log("Mods versions are not equal.");
        return false;
    } else {
        console.log("Mods versions are equal.");
        return true;
    }
};


const getLatestModsRelease = async () => {
    const octokit = new Octokit();
    let latestRelease = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
            owner: 'PatZab',
            repo: 'Die_Anstalt_Gaming_Valheim'
        }
    );

    console.log("Latest Mods Release: " + latestRelease.data.tag_name);
    return latestRelease.data.tag_name;
}

module.exports = {writeVersionToFile, checkModsVersion, getLatestModsRelease, getInstalledModsVersion};


