const fetch = require('node-fetch')
require("dotenv").config();

// source: https://codeburst.io/fetch-api-was-bringing-darkness-to-my-codebase-so-i-did-something-to-illuminate-it-7f2d8826e939
const checkStatus = response => {
    if (response.ok) {
        return response;
    } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

exports.FetchData = async function() {
    const query = 'Voetbal';
    const endpoint = 'https://zoeken.oba.nl/api/v1/search/?q=';
    const mediaCarrier = 'jeugd';
    const url = `${endpoint}${query}&authorization=${process.env.KEY}&output=json&p=${mediaCarrier}`;

    const config = {
        Authorization: `Bearer ${process.env.SECRET}`
    };

    console.log('fetch data...')

    return fetch(url, config)
        .then(checkStatus)
        .then(data => data.text())
        .then(data => JSON.parse(data.trim()))
        .catch(err => console.log(err));
}
