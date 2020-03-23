export function saveBook(id) {
    getLocalStorageItems() ? updateChoices(id) : setLocalStorage(id)
}

export function getLocalStorageItems() {
    return localStorage.getItem('books')
}

function setLocalStorage(id) {
    return localStorage.setItem('books', id)
}

function updateChoices(id) {
    if (!getLocalStorageItems().includes(id)) {
        const currentChoices = [].concat(getLocalStorageItems())
        currentChoices.push(id)

        setLocalStorage(currentChoices)
    }
}