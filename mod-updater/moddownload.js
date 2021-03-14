
const fs = require('fs');
const admZip = require('adm-zip');
const request = require('superagent');
const getLatestRelease = require('./get-latest-release');
const {writeVersionToFile} = require('./local-mod-version');


async function downloadMods() {
    const latestRelease = await getLatestRelease();
    const owner = "PatZab"
    const repoName = 'Die_Anstalt_Gaming_Valheim';
    const href = `https://github.com/${owner}/${repoName}/releases/download/${latestRelease}`;
    const zipFile = "Die_Anstalt_Gaming_Valheim.zip"
    const source = `${href}/${zipFile}`;

    const outputDir = 'C:\\Users\\PatZab\\Desktop\\test\\';

    request('get', source).on('error', (err) => {
        console.error(err);
    })
        .pipe(fs.createWriteStream(`${outputDir}${zipFile}`))
        .on('finish', () => {
            console.log('finished downloading');
            fs.rmdirSync(`${outputDir}Bepinex`, {recursive: true});
            console.log('deleted Bepinex folder')
            let zip = new admZip(zipFile, {});
            console.log("start unzip");
            zip.extractAllTo(outputDir, true, "test");
            console.log("finished unzip");
            fs.rmSync(`${outputDir}${zipFile}`);
            console.log(`deleted ${zipFile}`);
            writeVersionToFile(latestRelease);
        });

}

module.exports = downloadMods;



