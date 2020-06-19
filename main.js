const {app, BrowserWindow} = require('electron')
const storage = require('electron-json-storage')
const ipc = require('electron').ipcMain

/**
 * LOGIN WINDOW
 */
let loginWindow
const createLoginWindow = () => {
    loginWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    loginWindow.loadURL(`file://${__dirname}/views/login.html`)
}

/**
 * MAIN WINDOW
 */
let mainWindow
const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height:600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadURL(`file://${__dirname}/views/dashboard.html`)
}

/**
 * PDF PRINT WINDOW
 */
let pdfWindow
const createPdfWindow = () => {
    pdfWindow = new BrowserWindow({
        width: 842,
        height: 618,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    pdfWindow.loadURL(`file://${__dirname}/views/estate_print.html`)
}

app.whenReady().then(createLoginWindow).then(() => {
    /**
     * ON LOGIN SUCCESS
     * Set the token and the user data in JSONStorage,
     * and then create the main window
     * */
    ipc.on('login-success', (event, data) => {
        storage.set('user', data, () => {
            createMainWindow()
            loginWindow.hide()
        })
    })
})