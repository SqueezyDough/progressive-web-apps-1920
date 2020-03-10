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

async function FetchData(query) {
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const endpoint = 'https://zoeken.oba.nl/api/v1/search/?q=';
    const key = '03b058d877ec4276bb63dd1c6e1f3768';
    const secret = 'a431539891cc1fe6735239fa1c138ee7';
    const detail = 'Default';
    const mediaCarrier = 'jeugd';
    const url = `${cors}${endpoint}${query}&authorization=${key}&detaillevel=${detail}&output=json&p=${mediaCarrier}`;

    const config = {
        Authorization: `Bearer ${secret}`
    };

    console.log('fetch data...')

    return fetch(url, config)
        .then(checkStatus)
        .then(res => res.json())
        .catch(err => console.log(err));
}

export { FetchData };