import * as store from '../modules/store.js'
import { renderResults } from '../modules/render.js'
import * as overview from './overview.js'

export const layout = `
    {{#Results}}
        <article class="card--results">
            <span class="preference">{{preference}}%</span>
            {{#Topic.1}}
                <h2 class="card--results__title">{{TopicName}}</h2>
                {{#Books}}
                    <a href="{{detailLink}}" target="_blank">
                        <div class="card__front">
                            {{#coverimages.1}} <img class="card__image" src="{{coverimages.1}}" alt="{{frabl.key1}}"> {{/coverimages.1}}
                            {{^coverimages.1}} <p class="card__image__none"> Geen afbeelding </p> {{/coverimages.1}}
                        </div>

                        <div class="card__back">
                            <h2>{{frabl.key1}}</h2>
                            {{#summaries.0}} <p> {{summaries.0}} </p> {{/summaries.0}}
                            {{^summaries.0}} <p> Geen samenvatting </p> {{/summaries.0}}
                        </div>
                    </a>
                {{/Books}}
            {{/Topic.1}}
        </article>
    {{/Results}}
`

export function getResults(choices) {
    if (choices) {
        const data = JSON.parse(store.getLocalStorageItems())
        const books = findChoices(data, choices)
        const dataByTopic = sortByTopic(books, 'subject-topical')

        renderResults(dataByTopic)
        handleResultEvents()
    }
}

export function handleResultEvents() {
    const returnToCarousel = document.querySelector('.return')
    const clearStorage = document.querySelector('.remove')

    returnToCarousel.addEventListener('click', () => {
        overview.showCarousel()
    })

    clearStorage.addEventListener('click', () => {
        store.clearStorageItem('choices')
        overview.showCarousel()
    })
}

function findChoices(data, choices) {
    return data.Books.filter(book => choices.includes(book.id))
}

function sortByTopic(data, property) {
    return data.reduce((acc, obj) => {
        // property value
        let key = {}

        if (obj[property]) {
            key = obj[property][0].toLowerCase();
        }

        if (!acc[key]) {
            acc[key] = [];
            acc[key].push({
                TopicName: key,
                Books: []
            })
        }

        acc[key][0].Books.push(obj)

        return acc;
    }, {})
}