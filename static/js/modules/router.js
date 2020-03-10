import { FetchData } from './api.js';
import { startRender } from './render.js'
import dataHelper from './dataHelper.js'
import * as store from './store.js'

function handleRoutes() {
    routie({
        '': () => {
            if (store.dataInStorage()) {
                const data = JSON.parse(store.getLocalStorageItems())
                startRender(data)
            } else {
                const queries = [
                    'Voetbal',
                    'Politie',
                    'Brandweer',
                    'Planeet',
                    'Millieu',
                    'Dieren',
                    'Dinosaurus',
                    'Pesten',
                    'Smartphone',
                    'Social media',
                    'Muziek',
                    'Arme landen',
                    'Derde wereld'
                ]

                const books = queries.map(query => FetchData(query))
                Promise.all(books)
                    .then(data => dataHelper(data))
                    .then(data => store.storeData(data))
                    .then(data => startRender(JSON.parse(data)))
            }
        }
    });
}

export { handleRoutes }