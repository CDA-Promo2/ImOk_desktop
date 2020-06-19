const API_base_path = 'http://imok.am.manusien-ecolelamanu.fr/imok_api/current/public/api/'

const login = async (mail, password) => {
    return await fetch(API_base_path+'auth/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mail: mail,
            password: password
        })
    }).then(response => {
        if (response.status !== 200) return false
        return response.json().then(data => data)
    })
}

const fetchEstateByID = async (token, id) => {
    return await fetch(API_base_path+'estates/' + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    })
    .then(response => {
        if (response.status !== 200) return false
        return response.json().then(data => data)
    })
}

const fetchEstatesByCity = async (token, arg) => {
    return await fetch(API_base_path +'estates/search', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({city: arg})
    })
    .then(response => response.json()).then(data => data)
}

module.exports = Object.freeze({
    login: login,
    fetchEstateByID: fetchEstateByID,
    fetchEstatesByCity: fetchEstatesByCity
})