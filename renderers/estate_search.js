const storage = require('electron-json-storage')
const ipc = require('electron').ipcRenderer
const API = require('../helpers/API')

const estate_search_results = document.getElementById('estate_search_results')
const estate_search_results_count = document.getElementById('estate_search_results_count')
const estate_search_form = document.getElementById('estate_search_form')
const estate_search_input = document.getElementById('estate_search_input')
const estate_search_radio = document.getElementsByName('estate_search_radio')

const displayEstateResults = (data, isArray) => {
    let estateList = ''
    let estateCount = ''
    if(data) {
        if (isArray) {
            estateCount = `${data.estate.length} résultat(s) correspond(ent) à la recherche`
            estateList += data.estate.map(estate => (
                `<div class="col-md-4 col-sm-6 col-lg-3 mb-3">
                    <div class="card estate_card h-100">
                        <div class="estate_card_reference">Référence: #${("00000" + estate.id).slice(-5)}</div>
                        <div class="estate_card_img_wrapper">
                            <img src="../assets/img/maison.jpg" alt="" class="estate_card_img">
                            <div class="estate_card_price">${estate.price ? new Intl.NumberFormat('de-DE').format(estate.price).replace('.', ' ') + ' €' : '--'}</div>
                        </div>
                        <div class="estate_card_type">${estate.estate_type ?? '--'}</div>
                        <div class="estate_card_address">${estate.address ?? '--'}</div>
                        <div class="estate_card_city">${estate.city ?? '--'} (${estate.zip_code ?? '--'})</div>
                    </div>
                </div>`
            )).join('')
        } else {
            let estate = data.estate
            estateCount = '1 résultat correspond à la recherche'
            estateList +=
                `<div class="col-md-4 col-sm-6 col-lg-3 mb-3">
                    <div class="card estate_card h-100">
                        <div class="estate_card_reference">Référence: #${("00000" + estate.id).slice(-5)}</div>
                        <div class="estate_card_img_wrapper">
                            <img src="../assets/img/maison.jpg" alt="" class="estate_card_img">
                            <div class="estate_card_price">${estate.price ? new Intl.NumberFormat('de-DE').format(estate.price).replace('.', ' ') + ' €' : '--'}</div>
                        </div>
                        <div class="estate_card_type">${estate.estate_type ?? '--'}</div>
                        <div class="estate_card_address">${estate.address ?? '--'}</div>
                        <div class="estate_card_city">${estate.city ?? '--'} (${estate.zip_code ?? '--'})</div>
                    </div>
                </div>`
        }
    } else {
        estateCount = `Aucun résultat`
    }
    estate_search_results_count.innerHTML = estateCount
    estate_search_results.innerHTML = estateList
}

storage.get('user', (err, arg) => {
    const auth_token = arg.access_token

    estate_search_form.onsubmit = (event) => {
        event.preventDefault()

        if (estate_search_radio[0].checked === true) {
            /** SEARCH BY ID */
            API.fetchEstateByID(auth_token, estate_search_input.value).then((data) => {
                displayEstateResults(data,false)
            })
        } else {
            /** SEARCH BY CITY NAME */
            API.fetchEstatesByCity(auth_token, estate_search_input.value).then((data) => {
                displayEstateResults(data, true)
            })
        }
    }
})