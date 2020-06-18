const {app, BrowserWindow} = require('electron')

const createWindow = () => {
    win = new BrowserWindow({
        width: 842,
        height: 618,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    win.loadURL(`file://${__dirname}/views/estate_print.html`)
}

app.whenReady().then(createWindow)