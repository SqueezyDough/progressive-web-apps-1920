const api = require('./api.controller')
const render = require('./render.controller')
require("dotenv").config();

exports.init = function(req, res) {
    api.FetchData()
        .then(data => {
            const randomizedData = takeRandomResultsFromList(data.results)
            const viewName = 'home'
            const viewData = {
                app: process.env.NAME,
                books: randomizedData
            }

            render.renderView(res, viewName, viewData)
        })
}

function takeRandomResultsFromList(data) {
    let randomResults = [];
    for (let i = 0; i < 5; i++) {
        randomResults.push(data[randomNumberGenerator(data.length)])
    }
    return randomResults;
}

function randomNumberGenerator(maxValue) {
    return Math.floor(Math.random() * maxValue)
}
