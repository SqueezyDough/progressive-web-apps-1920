export function storeData(data) {
    if (dataInStorage()) {
        return getLocalStorageItems();
    } else {
        setLocalStorage(data)
        return getLocalStorageItems();
    }
}

export function dataInStorage() {
    return getLocalStorageItems() ? true : false
}

export function getLocalStorageItems() {
    return localStorage.getItem('books')
}

export function clearStorageItem(key) {
    localStorage.removeItem(key);
}

function setLocalStorage(data) {
    return localStorage.setItem('books', JSON.stringify(data))
}

export function storeChoice(id) {
    getLocalStorageChoices() ? updateChoices(id) : setLocalStorageChoices(id)
}

export function getLocalStorageChoices() {
    return localStorage.getItem('choices')
}

function setLocalStorageChoices(id) {
    return localStorage.setItem('choices', id)
}

function updateChoices(id) {
    if (!getLocalStorageChoices().includes(id)) {
        const currentChoices = [].concat(getLocalStorageChoices())
        currentChoices.push(id)

        setLocalStorageChoices(currentChoices)
    }
}
