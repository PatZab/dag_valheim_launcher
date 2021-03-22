const {contextBridge, ipcRenderer, dialog} = require('electron');
const Vue = require('vue');

contextBridge.exposeInMainWorld("api", {

  usingVue() {
    let app = Vue.createApp({
      data() {
        return {
          installedVhVersion: this.getInstalledVhVersion(),
          latestVhRelease: ""
        }
      },
      methods: {
        getInstalledVhVersion() {
          ipcRenderer.on("display-mods-version", (event, args) => {
            return args;
          });
        },
        getlatestVhRelease() {
          ipcRenderer.on("display-latest-release", (event, args) => {
            this.latestVhRelease = args;
          });
        }
      }
    })
    app.mount('#info')

  },

  startGame() {
    document.getElementById('start-valheim').addEventListener('click', () => {
      if (document.getElementById("start-valheim").innerHTML === "Launch Valheim") {
        ipcRenderer.send('launch-game');
      } else if (document.getElementById("start-valheim").innerHTML === "Update Mods!") {
        ipcRenderer.send('update-mods');
      }
    });
  },

  sendValheimPath() {
    document.getElementById("set-path-to-valheim").addEventListener("click", ev => {
      ipcRenderer.send("valheim-path-set");
    });
  },

  enableLaunchButton() {
    ipcRenderer.on('enable-launch-button', event => {

      document.getElementById("start-valheim").removeAttribute("disabled");

      document.getElementById('start-valheim').innerHTML = "Launch Valheim";
      console.log("LaunchButton enabled")
    });
  },

  enableUpdateButton() {
    ipcRenderer.on("enable-update-button", event => {
      document.getElementById("start-valheim").removeAttribute("disabled");
      document.getElementById("start-valheim").innerHTML = "Update Mods!"
    });
  },

  displayInstalledModsVersion() {
    ipcRenderer.on("display-mods-version", (event, args) => {
      document.getElementById("version-number").innerHTML = args;
    });
  },

  displayLatestRelease() {
    ipcRenderer.on("display-latest-release", (event, args) => {
      document.getElementById("release-version").innerHTML = args;
    });
  },

  displayVhDir() {
    ipcRenderer.on('display-vh-dir', (event, args) => {
      document.getElementById('vh-dir').innerHTML = args;
    });
  },

  displayAppVersion() {
    ipcRenderer.on("display-app-version", (event, args) => {
      document.getElementById("app-version").innerHTML = args;
    });
  },


  quitApp() {
    document.getElementById("quit-app").addEventListener('click', ev => {
      ipcRenderer.send('quit-app');
    });
  }
});