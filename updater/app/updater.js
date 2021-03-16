const {autoUpdater} = require("electron-updater");
const {dialog} = require('electron');

// Configure log debugging
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

//Disabel auto downloading of updates
autoUpdater.autoDownload = false;

module.exports = () => {

    // Check for update (GH Release)
    autoUpdater.checkForUpdates()

    // Listen for update found
    autoUpdater.on('update-available', () => {

        // Prompt user to start download
        dialog.showMessageBox({
            type: "info",
            title: "Update available",
            message: "A newer version of DAG Valheim Launcher is available. Do you want to update now?",
            buttons: ["Update"]
        }).then((result) => {
            let buttonIndex = result.response

            if (buttonIndex === 0)
                autoUpdater.downloadUpdate()
        });
    });

    // Listen for update downloaded
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: 'Install and restart now?',
            buttons: ["Install now"]
        }).then(result => {
            let buttonIndex = result.response;
            if (buttonIndex === 0) {
                autoUpdater.quitAndInstall(true, true);
            }
        });
    });
};