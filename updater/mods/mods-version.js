const {Octokit} = require("@octokit/rest")
const fs = require('fs');
const {checkFileExistence} = require("../../checks/file-existing-check");
const {downloadMods} = require('./mods-downloader');

let entirePathToVersion;
let installedModsVersion;
let latestModsRelease;

const writeVersionToFile = () => {
    fs.writeFileSync(entirePathToVersion, latestModsRelease);
    console.log("Written version to file");
};

const createVersionFile = () => {
    let noVersion = "not installed";
    fs.writeFileSync(entirePathToVersion, noVersion);
    console.log("Created version file with value: " + noVersion);
};

const getInstalledModsVersion = appDataPath => {

    entirePathToVersion = `${appDataPath}\\dag_mods_version.txt`;
    if (checkFileExistence(entirePathToVersion)) {
        let installedVersion = fs.readFileSync(entirePathToVersion);
        console.log("Got installed version: " + installedVersion.toString());
        return installedVersion.toString();
    } else {
        createVersionFile();
        getInstalledModsVersion(appDataPath);
    }
};

const checkModsVersion = async (appDataPath, vhInstallDir) => {
    installedModsVersion = getInstalledModsVersion(appDataPath);
    latestModsRelease = await getLatestModsRelease();
    if (!(installedModsVersion === latestModsRelease)) {
        await downloadMods(vhInstallDir, latestModsRelease);
        writeVersionToFile()
    }
};


const getLatestModsRelease = async () => {
    const octokit = new Octokit();
    let latestRelease = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
            owner: 'PatZab',
            repo: 'Die_Anstalt_Gaming_Valheim'
        }
    );
    console.log("Got latest mods version: " + latestRelease.data.tag_name);
    return latestRelease.data.tag_name;
}

module.exports = {writeVersionToFile, checkModsVersion, getLatestModsRelease, getInstalledModsVersion};


