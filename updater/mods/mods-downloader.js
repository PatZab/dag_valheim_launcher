const fs = require('fs');
const admZip = require('adm-zip');
const request = require('superagent');
const electronDL = require('electron-dl');


const downloadLatestMods = async (mainWindow, latestRelease, vhInstallDir) => {
    const owner = "PatZab"
    const repoName = 'Die_Anstalt_Gaming_Valheim';
    const href = `https://github.com/${owner}/${repoName}/releases/download/${latestRelease}`;
    const zipFile = "Die_Anstalt_Gaming_Valheim.zip"
    const source = `${href}/${zipFile}`;
    const outputDir = `${vhInstallDir}\\`;

    console.log("Starting download!");

    await electronDL.download(mainWindow, source, {
        directory: vhInstallDir
    })
    console.log('Finished downloading');
    fs.rmdirSync(`${outputDir}Bepinex`, {recursive: true});
    console.log('Deleted old \"Bepinex\" folder')
    let zip = new admZip(outputDir + zipFile, {});
    console.log("Start unzipping.");
    zip.extractAllTo(outputDir, true, "test");
    console.log("Finished unzipping.");
    fs.rmSync(`${outputDir}${zipFile}`);
    console.log(`Deleted ${zipFile}`);

};

// const downloadMods =  async (vhInstallDir, latestRelease) => {
//     const owner = "PatZab"
//     const repoName = 'Die_Anstalt_Gaming_Valheim';
//     const href = `https://github.com/${owner}/${repoName}/releases/download/${latestRelease}`;
//     const zipFile = "Die_Anstalt_Gaming_Valheim.zip"
//     const source = `${href}/${zipFile}`;
//
//     const outputDir = `${vhInstallDir}\\`;
//     console.log("Starting download!")
//     await request('get', source).on('error', (err) => {
//         console.error(err);
//     })
//         .pipe(await fs.createWriteStream(`${outputDir}${zipFile}`))
//         .on('finish', () => {
//             console.log('Finished downloading');
//             fs.rmdirSync(`${outputDir}Bepinex`, {recursive: true});
//             console.log('Deleted old \"Bepinex\" folder')
//             let zip = new admZip(outputDir + zipFile, {});
//             console.log("Start unzipping.");
//             zip.extractAllTo(outputDir, true, "test");
//             console.log("Finished unzipping.");
//             fs.rmSync(`${outputDir}${zipFile}`);
//             console.log(`Deleted ${zipFile}`);
//         });
// };

module.exports = {/*downloadMods,*/downloadLatestMods};



