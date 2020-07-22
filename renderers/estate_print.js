const html2canvas = require('html2canvas')
const jsPDF = require('jspdf')
const storage = require('electron-json-storage')

/**
 * FAKE DATA
 */

storage.get('estate_to_print', (err, estate_to_print) => {
    populateView(estate_to_print)
})


const populateView = (estate) => {
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
