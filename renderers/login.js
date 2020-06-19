const ipc = require('electron').ipcRenderer;
const API = require('../helpers/API')

const loginButton = document.getElementById('login')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')

loginButton.onclick = () => {
    if(emailInput.value !== '' && passwordInput.value !== '') {
        API.login(emailInput.value, passwordInput.value).then((data)=> {
            if(data) {
                ipc.send('login-success', data )
            }
        })
    }
}