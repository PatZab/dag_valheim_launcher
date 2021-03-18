const fs = require('fs');

let getAppVersion = () => {

    let rawData = fs.readFileSync(__dirname + "\\app-version.json");
    let json = JSON.parse(rawData);
    let appVersionExtract = json.version;

    let appVersion = "v" + appVersionExtract;

    console.log("Extracted current app version: " + appVersion);

    return appVersion;

};

console.log(getAppVersion())

module.exports = {getAppVersion}
