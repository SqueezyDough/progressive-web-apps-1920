const http = require('http');
const cloneResponse = require('clone-response');
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
                allData: JSON.stringify(data),
                carouselData: randomizedData
            }

            render.renderView(res, viewName, viewData)
        })
}

exports.results = function(req, res) {
    const choices = req.body.carouselChoices.split(',')
    const allBooks = JSON.parse(req.body.allData).results
    const bookJson = getAllChoices(allBooks, choices)

    console.log(bookJson)

    const viewName = 'pages/results'
    const viewData = {
        app: process.env.NAME,
        books: bookJson
    }

    render.renderView(res, viewName, viewData)
}

exports.offline = function(req, res) {
    const viewName = 'pages/offline'
    const viewData = {
        app: process.env.NAME
    }

    render.renderView(res, viewName, viewData)
}

function getAllChoices(collection, choices) {
    return collection.filter(book => choices.includes(book.id))
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
