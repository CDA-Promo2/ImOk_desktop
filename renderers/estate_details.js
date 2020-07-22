const storage = require('electron-json-storage')
const API = require('../helpers/API')
const ipc = require('electron').ipcRenderer

const form = document.getElementById('form')
const form_image = document.getElementById('form_image')
const image_select = document.getElementById('image_select')

/** TODO: GET REAL IMAGES */
const fakeImages = [{url: '../assets/img/maison.jpg'}, {url: '../assets/img/maison.jpg'}, {url: '../assets/img/maison.jpg'}]

const populateEstateCard = (estate) => {
    form_image.value = fakeImages[0].url;
    let count = 0
    image_select.innerHTML = fakeImages.map((item) => {
        count ++
        return `<div class="col-3"><img src="${item.url}" class="img-fluid image_select_item${count ===1 ? ' selected' : ''}"></div>`
    }).join('')
}

const load_preview = (estate, submittedForm) => {
    let estate_to_print = {
        id: estate.id,
        city: estate.city,
        district: submittedForm.get('district'),
        estate_type: estate.estate_type,
        rooms: estate.rooms,
        bedrooms: estate.bedrooms,
        carrez_size: estate.carrez_size,
        description: submittedForm.get('description'),
        price: estate.price,
        energy_consumption: estate.energy_consumption,
        gas_emission: estate.gas_emission,
        picture: submittedForm.get('image'),
    }
    let orientation = submittedForm.get('orientation')

    ipc.send('load_pdf_window', {estate_to_print, orientation})
}

/**
 * ============
 * HERE WE GO !
 * ============
 */
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

        form.onsubmit = (e) => {
            e.preventDefault()
            load_preview(estate.estate, new FormData(e.target))
        }
    })
})

