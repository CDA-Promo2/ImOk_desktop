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
        show: false,
        webPreferences: {
            nodeIntegration: true,
        }
    })
    loginWindow.loadURL(`file://${__dirname}/views/login.html`)
    loginWindow.once('ready-to-show', () => {loginWindow.show()})
}

/**
 * MAIN WINDOW
 */
let mainWindow
const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height:600,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadURL(`file://${__dirname}/views/dashboard.html`)
    mainWindow.once('ready-to-show', () => {mainWindow.show()})
}

/**
 * PDF PRINT WINDOW
 */
const createPdfWindow = (orientation) => {
    let pdfWindow = new BrowserWindow({
        width: orientation === 'landscape' ? 842 : 618,
        height: orientation === 'landscape' ? 618 : 842,
        show: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    pdfWindow.loadURL(`file://${__dirname}/views/estate_print_${orientation}.html`)
    pdfWindow.once('ready-to-show', () => {
        pdfWindow.show()
    })
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

    ipc.on('load_pdf_window', (event, data) => {
        let estate_to_print = data.estate_to_print
        let orientation = data.orientation

        storage.set('estate_to_print', estate_to_print, () => {
            createPdfWindow(orientation)
        })
    })
})
