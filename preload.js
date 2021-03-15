const {contextBridge, ipcRenderer, dialog} = require('electron');

contextBridge.exposeInMainWorld("api", {
    startGame() {
        const exec = require('child_process').execFile;
        const startButton = document.getElementById('start-valheim');
        startButton.addEventListener('click', () => {
            exec("F:\\Games\\SteamLibrary\\steamapps\\common\\Valheim\\valheim.exe");
        });
    },

    sendValheimPath() {
        document.getElementById("set-path-to-valheim").addEventListener("click", ev => {
            // dialog.showOpenDialog({
            //     defaultPath: "C:\\",
            //     properties: ["openDirectory"]
            // }).then(result => {
                ipcRenderer.send("valheim-path-set");
            // });
        });
    }
});