const storage = require('electron-json-storage')
const API = require('../helpers/API')
const ipc = require('electron').ipcRenderer

const form = document.getElementById('form')
const form_image = document.getElementById('form_image')
const image_select = document.getElementById('image_select')

/** TODO: GET REAL IMAGES */
const fakeImages = [{url: '../assets/img/maison.jpg'}, {url: '../assets/img/maison.jpg'}, {url: '../assets/img/maison.jpg'}]

const populateEstateCard = (estate) => {
    document.getElementById('form_description').innerText = estate.description

    const estateSpecs = [
        {name: 'Référence', bool: false, value: estate.id ? '#' + ("00000" + estate.id).slice(-5) : 'nc' },
        {name: 'Type de bien', bool: false, value: estate.estate_type ?? 'nc' },
        {name: 'Copropriété', bool: true, value: estate.joint_ownership ?? 'nc' },
        {name: 'Mittoyenneté', bool: true, value: estate.condominium ?? 'nc' },
        {name: 'Prix de vente', bool: false, value: estate.price ? estate.price + '€' :  'nc' },
        {name: 'Addresse', bool: false, value: (estate.street ?? null) + ' ' + (estate.complement ?? null) + ' ' + (estate.zip_code ?? null) + ' ' + (estate.city ?? null) },
        {name: 'Surface', bool: false, value: (estate.size ? estate.size + 'm2 ' : '') + (estate.carrez_size ? `(${estate.carrez_size}m2 loi Carrez)` : '') },
        {name: 'Nombre d\'étages' , bool: false, value: estate.floor ?? 'nc' },
        {name: 'Étage', bool: false, value: estate.floor_number ?? 'nc' },
        {name: 'Exposition', bool: false, value: estate.exposition ?? 'nc' },
        {name: 'Nb de pièces', bool: false, value: estate.rooms_numbers ?? 'nc' },
        {name: 'Nb de chambres', bool: false, value: estate.bedroom_numbers ?? 'nc' },
        {name: 'Consom. Energétique', bool: false, value: estate.energy_consumption ?? 'nc' },
        {name: 'Emmission Co2', bool: false, value: estate.gas_emission ?? 'nc' },
        {name: 'Type de chauffage', bool: false, value: estate.heating_type ?? 'nc' },
        {name: 'Autour du bien', bool: false, value: estate.facilities ?? 'nc' },
    ]

    const estate_info_content =
        '<ul class="estate_info_list">'
        + estateSpecs.map((item) => {
            if (item.bool && item.value !== 'nc') {
                return `<li><span>${item.name}</span><span>${item.value === 1 ? 'oui' : 'non'}</span></li>`
            } else {
                return `<li><span>${item.name}</span><span>${item.value}</span></li>`
            }
        }).join('')
        + '</ul>';

    console.log(estate_info_content)


    document.getElementById('estate_info').innerHTML=estate_info_content


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
        rooms: estate.rooms_numbers,
        bedrooms: estate.bedroom_numbers,
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
