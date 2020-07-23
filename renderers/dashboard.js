const storage = require('electron-json-storage')

storage.get('user', (err, arg) => {
    document.getElementById('homepage_welcome').innerText = `Bienvenue ${arg.user.firstname}`
})
