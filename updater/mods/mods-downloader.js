const fs = require('fs');
const admZip = require('adm-zip');
const request = require('superagent');

const downloadMods = async (vhInstallDir, latestRelease) => {
    const owner = "PatZab"
    const repoName = 'Die_Anstalt_Gaming_Valheim';
    const href = `https://github.com/${owner}/${repoName}/releases/download/${latestRelease}`;
    const zipFile = "Die_Anstalt_Gaming_Valheim.zip"
    const source = `${href}/${zipFile}`;

    const outputDir = `${vhInstallDir}\\`;

    await request('get', source).on('error', (err) => {
        console.error(err);
    })
        .pipe(fs.createWriteStream(`${outputDir}${zipFile}`))
        .on('finish', () => {
            console.log('finished downloading');
            fs.rmdirSync(`${outputDir}Bepinex`, {recursive: true});
            console.log('deleted Bepinex folder')
            let zip = new admZip(outputDir + zipFile, {});
            console.log("start unzip");
            zip.extractAllTo(outputDir, true, "test");
            console.log("finished unzip");
            fs.rmSync(`${outputDir}${zipFile}`);
            console.log(`deleted ${zipFile}`);
            // writeVersionToFile(latestRelease);
        });
    console.log("test")
};

module.exports = {downloadMods};



