const storage = require('electron-json-storage')
const API = require('../helpers/API')
const ipc = require('electron').ipcRenderer

const form_image = document.getElementById('form_image')
const form_district = document.getElementById('form_district')
const form_description = document.getElementById('form_district')
const form_submit = document.getElementById('form_submit')

const populateEstateCard = (estate) => {
    console.log(estate)
}

const load_preview = () => {
    let estate = {toto:'tata'}
    /** TODO : populate estate */
    ipc.send('load_pdf_window', estate)
}

storage.get('user', (err, arg) => {
    const auth_token = arg.access_token
    const estate_id = new URLSearchParams(new URL(location.href).search).get('estate')

    API.fetchEstateByID(auth_token, estate_id).then((estate) => {
        populateEstateCard(estate.estate)

        $('.image_select_item').click(function() {
            $('.image_select_item').removeClass('selected')
            $(this).addClass('selected')
            form_image.value = $(this).attr('src')
        })

        form_submit.onclick = load_preview
    })
})

