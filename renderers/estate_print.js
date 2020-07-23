const html2canvas = require('html2canvas')
const jsPDF = require('jspdf')
const storage = require('electron-json-storage')

const   estate_reference = document.getElementById('estate_reference'),
        estate_city = document.getElementById('estate_city'),
        estate_district = document.getElementById('estate_district'),
        estate_type = document.getElementById('estate_type'),
        estate_rooms = document.getElementById('estate_rooms'),
        estate_bedrooms = document.getElementById('estate_bedrooms'),
        estate_carrez = document.getElementById('estate_carrez'),
        estate_description =document.getElementById('estate_description'),
        estate_price =document.getElementById('estate_price'),
        estate_energy =document.getElementById('estate_energy'),
        estate_gas =document.getElementById('estate_gas'),
        estate_picture =document.getElementById('estate_picture')

let orientation
let estate
storage.get('estate_to_print', (err, data) => {
    orientation = data.orientation
    estate = data.estate_to_print
    populateView(data.estate_to_print)
})

/**
 * DATA FILLING
 */
const populateView = (estate) => {
    estate_reference.innerHTML = `Référence: #${("00000" + estate.id).slice(-5)}`
    if (!estate.id) estate_reference.setAttribute('hidden', 'true')

    estate_city.innerHTML = estate.city
    if (!estate.city) estate_city.setAttribute('hidden', 'true')

    estate_district.innerHTML = estate.district
    if (!estate.district) estate_district.setAttribute('hidden', 'true')

    estate_type.innerHTML = estate.estate_type
    if (!estate.estate_type) estate_type.setAttribute('hidden', 'true')

    estate_rooms.innerHTML = `${estate.rooms} pièces`
    if (!estate.rooms) estate_rooms.setAttribute('hidden', 'true')

    estate_bedrooms.innerHTML = `${estate.bedrooms} chambres`
    if (!estate.bedrooms) estate_bedrooms.setAttribute('hidden', 'true')

    estate_carrez.innerHTML = `${estate.carrez_size} m² loi Carrez`
    if (!estate.carrez_size) estate_carrez.setAttribute('hidden', 'true')

    estate_description.innerHTML = estate.description
    if (!estate.description) estate_description.setAttribute('hidden', 'true')

    estate_price.innerHTML = new Intl.NumberFormat('de-DE').format(estate.price).replace('.', ' ') + ' €'
    if (!estate.price) estate_price.setAttribute('hidden', 'true')

    estate_picture.setAttribute('src', estate.picture)

    /** GAS AND ENERGY CURSOR SET */
    let topPos;

    /** ENERGY */
    const energyValue = estate.energy_consumption ?? 'NC'
    estate_energy.setAttribute('data-value', energyValue)
    if (energyValue !== 'NC') {
        if (energyValue <= 50) topPos = 9
        else if (energyValue <= 90) topPos = 27
        else if (energyValue <= 150) topPos = 45
        else if (energyValue <= 230) topPos = 64
        else if (energyValue <= 330) topPos = 82
        else if (energyValue <= 450) topPos = 99
        else topPos = 118
        estate_energy.setAttribute('style', `top: ${topPos}px;`)
    } else {
        estate_energy.setAttribute('hidden', 'true')
        estate_energy.parentElement.classList.add('undefined')
    }

    /** GAS */
    const gasValue = estate.gas_emission ?? 'NC'
    estate_gas.setAttribute('data-value', gasValue)
    if (gasValue !== 'NC') {
        if (gasValue <= 5) topPos = 9
        else if (gasValue <= 10) topPos = 27
        else if (gasValue <= 20) topPos = 45
        else if (gasValue <= 35) topPos = 64
        else if (gasValue <= 55) topPos = 82
        else if (gasValue <= 80) topPos = 99
        else topPos = 118
        estate_gas.setAttribute('style', `top: ${topPos}px;`)
    } else {
        estate_gas.setAttribute('hidden', 'true')
        estate_gas.parentElement.classList.add('undefined')
    }

    /**
     * HTML TO PDF
     */
    document.getElementById('saveBtn').onclick = () => handle_save()
}

const setupCanvas = () => html2canvas(document.querySelector('#estate_print'), {
    scrollY: -window.scrollY,
    scale: 4,
    useCORS: true,
    allowTaint: true
})

const savePDF = (canvas) => {
    const filename = `IMOK_ref${("00000" + estate.id).slice(-5)}_${orientation}.pdf`
    const pdf = new jsPDF(orientation === 'landscape' ? 'l' : 'p', 'mm', 'a4')
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG',0, 0,
        orientation === 'landscape' ? 297 : 210,
        orientation === 'landscape' ? 210 : 297
    )
    pdf.save(filename)
}

const handle_save = () => {
    setupCanvas().then(canvas => savePDF(canvas))
}
