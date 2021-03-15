const {contextBridge, ipcRenderer, dialog} = require('electron');

contextBridge.exposeInMainWorld("api", {
    startGame() {
        document.getElementById('start-valheim').addEventListener('click', () => {
            ipcRenderer.send('launch-game');
        });
    },

    sendValheimPath() {
        document.getElementById("set-path-to-valheim").addEventListener("click", ev => {
            ipcRenderer.send("valheim-path-set");
        });
    },

    enableLaunchButton() {
        ipcRenderer.on('enable-launch-button', event => {
            document.getElementById('start-valheim').removeAttribute("disabled")
            console.log("LaunchButton enabled")
        });
    },

    displayInstalledModsVersion() {
        ipcRenderer.on("display-mods-version", (event, args) => {
            document.getElementById("version-number").innerHTML = args;
        });
    }
});