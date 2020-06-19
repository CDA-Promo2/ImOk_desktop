const html2canvas = require('html2canvas')
const jsPDF = require('jspdf')

/**
 * FAKE DATA
 */
const estate = {
    id: 1,
    city: 'Taverny',
    district: 'Quartier St Acheul',
    estate_type: 'Maison',
    rooms: 7,
    bedrooms: 3,
    carrez_size: 120.2,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 227000,
    energy_consumption: 235,
    gas_emission: 50,
    picture: 'https://cdn.vox-cdn.com/thumbor/XUdUk_rKJ8WDTd0zksnnicYDwbY=/0x0:3760x2500/1200x800/filters:focal(1580x950:2180x1550)/cdn.vox-cdn.com/uploads/chorus_image/image/65135516/shutterstock_349464740.0.jpg'
}

/**
 * DATA FILLING
 */
document.getElementById('estate_reference').innerHTML = `Référence: #${("00000" + estate.id).slice(-5)}`
document.getElementById('estate_city').innerHTML = estate.city
document.getElementById('estate_district').innerHTML = estate.district
document.getElementById('estate_type').innerHTML = estate.estate_type
document.getElementById('estate_rooms').innerHTML = `${estate.rooms} pièces`
document.getElementById('estate_bedrooms').innerHTML = `${estate.bedrooms} chambres`
document.getElementById('estate_carrez').innerHTML = `${estate.carrez_size} m² loi Carrez`
document.getElementById('estate_description').innerHTML = estate.description
document.getElementById('estate_price').innerHTML = new Intl.NumberFormat('de-DE').format(estate.price).replace('.', ' ') + ' €'
document.getElementById('estate_energy').setAttribute('data-value', estate.energy_consumption)
document.getElementById('estate_gas').setAttribute('data-value', estate.gas_emission)
document.getElementById('estate_picture').setAttribute('src', estate.picture)

/**
 * GAS AND ENERGY CURSOR SET
 */
const energyCursor = document.getElementById('estate_energy')
const energyValue = parseInt(energyCursor.getAttribute('data-value'))
const gasCursor = document.getElementById('estate_gas')
const gasValue = parseInt(gasCursor.getAttribute('data-value'))

let topPos;
if (energyValue <= 50) topPos = 9
else if (energyValue <= 90) topPos = 27
else if (energyValue <= 150) topPos = 45
else if (energyValue <= 230) topPos = 64
else if (energyValue <= 330) topPos = 82
else if (energyValue <= 450) topPos = 99
else topPos = 118
energyCursor.setAttribute('style', `top: ${topPos}px;`)

if (gasValue <= 5) topPos = 9
else if (gasValue <= 10) topPos = 27
else if (gasValue <= 20) topPos = 45
else if (gasValue <= 35) topPos = 64
else if (gasValue <= 55) topPos = 82
else if (gasValue <= 80) topPos = 99
else topPos = 118
gasCursor.setAttribute('style', `top: ${topPos}px;`)

/**
 * HTML TO PDF
 */
document.getElementById('saveBtn').onclick = () => {
    print()
}

function print() {
    const filename = 'nouveau.pdf'
    html2canvas(document.querySelector('#estate_print'), {
        scale: 4,
        useCORS: true,
        allowTaint: true
    })
        .then(canvas => {
            let pdf = new jsPDF('l', 'mm', 'a4');
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210);
            pdf.save(filename);
        });
}