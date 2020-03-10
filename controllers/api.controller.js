const fetch = require('node-fetch')

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

exports.FetchData = async function(query) {
    const key = '3e248cc94249534feabf5f4ddf33327c';

    return fetch(`https://api.themoviedb.org/3/movie/popular/?api_key=${key}`)
        .then(checkStatus)
        .then(res => res.json())
        .catch(err => console.log(err))
}
