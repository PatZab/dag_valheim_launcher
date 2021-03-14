const getLatestRelease = require('./get-latest-release');
const {getInstalledVersion} = require('./local-mod-version');

const versionCheck = async (appDataPath) => {
    return getInstalledVersion(appDataPath) === await getLatestRelease();
};

module.exports = versionCheck;