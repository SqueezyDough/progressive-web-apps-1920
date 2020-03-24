const api = require('./api.controller')
const render = require('./render.controller')
const store = require('./collection.controller')

require("dotenv").config();

exports.init = function(req, res) {
    api.FetchData()
        .then(data => store.saveCollection('./collection/books.json', data))
        .then(data => {
            const randomizedData = takeRandomResultsFromList(data.results)

            const viewName = 'home'
            const viewData = {
                app: process.env.NAME,
                carouselData: randomizedData
            }

            render.renderView(res, viewName, viewData)
        })
}

exports.overview = function(req, res) {
    const choices = store.getCollection('./collection/choices.json')

    console.log('choices', choices)

    const viewName = 'pages/results'
    const viewData = {
        app: process.env.NAME,
        books: choices,
        booksStringify: JSON.stringify(choices)
    }

    render.renderView(res, viewName, viewData)
}

exports.postResults = function(req, res) {
    const choices = req.body.carouselChoices.split(',')
    const allBooks = store.getCollection('./collection/books.json').results
    const bookJson = getAllChoices(allBooks, choices)

    store.saveCollection('./collection/choices.json', bookJson)

    const viewName = './overview'

    res.redirect(viewName)
}

exports.details = function(req, res) {
    const allBooks = store.getCollection('./collection/books.json').results
    const book = findBook(allBooks, req.params.id)

    console.log(book)

    const viewName = 'pages/details'
    const viewData = {
        app: process.env.NAME,
        book: book
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

function findBook(books, id) {
    return books.find(book => book.id === id)
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
