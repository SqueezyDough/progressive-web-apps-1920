import { createRenderableObject, createResultsObject } from './dataHelper.js'
import * as helper from './dataHelper.js'
import * as overviewTemplate from '../templates/overview.js'
import * as resultsTemplate from '../templates/results.js'

export function startRender(data) {
    const renderObject = readyCarouselData(data)
    renderTemplate(renderObject, overviewTemplate, '.books-overview')
    overviewTemplate.handleEvents();
    automatedCarousel(data)
}

export function renderResults(data) {
    const renderObject = createResultsObject(data)
    const dataByPreference = helper.calculatePreferences(renderObject)
    const sortedPreferences = helper.sortBooks(dataByPreference);

    renderTemplate(sortedPreferences, resultsTemplate, '.results')
}

function readyCarouselData(data) {
    const CarouselData = takeRandomResultsFromList(data.Books)
    return createRenderableObject(CarouselData)
}

function renderTemplate(data, template, location) {
    document.querySelector(location).innerHTML = ''
    const insertContainer = document.querySelector(location);
    insertContainer.insertAdjacentHTML('beforeend', Mustache.to_html(template.layout, data));
}

function automatedCarousel(data) {
    setInterval(() => {
        const renderObject = readyCarouselData(data)
        renderTemplate(renderObject, overviewTemplate, '.books-overview')
        overviewTemplate.handleEvents();
    }, 25000)
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

export { renderTemplate }