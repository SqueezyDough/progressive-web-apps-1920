import * as store from './modules/store.js'

(function init() {
    handleCarouselClickevents()
    handleReadyClickEvent()
})()

function handleCarouselClickevents() {
    const books = document.querySelectorAll('.card.-carousel')

    books.forEach(book => {
        book.addEventListener('click', () => {
            const id = book.getAttribute('data-id')
            console.log(id)

            store.saveBook(id)
        })
    })
}

function handleReadyClickEvent() {
    const btnReady = document.getElementById('btn_done')

    btnReady.addEventListener('click', (e) => {
        submitData(e)
    })
}

function submitData(e) {
    e.preventDefault()

    const books = store.getLocalStorageItems()
    const hiddenInput = document.getElementById('submit_data')
    const form = document.getElementById('form_carousel')

    hiddenInput.value = books

    form.submit()
}