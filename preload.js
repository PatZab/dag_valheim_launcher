const {contextBridge} = require('electron');

contextBridge.exposeInMainWorld("api", {
    startGame() {
        const exec = require('child_process').execFile;
        const startButton = document.getElementById('start-valheim');
        startButton.addEventListener('click', () => {
            exec("F:\\Games\\SteamLibrary\\steamapps\\common\\Valheim\\valheim.exe");
        });
    }
});