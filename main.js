const {app, BrowserWindow} = require('electron')

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    win.loadURL(`file://${__dirname}/views/index.html`)
}

app.whenReady().then(createWindow)