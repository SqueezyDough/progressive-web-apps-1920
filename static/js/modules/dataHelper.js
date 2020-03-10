export default function cleanData(data) {
    const booksPerCategory = getBooksPerCategory(data)
    const allBooks = mergeCategories(booksPerCategory)
    const randomizedBooks = shuffleList(allBooks);

    return createRenderableObject(randomizedBooks)
}

export function createRenderableObject(data) {
    return { Books: data }
}

export function createResultsObject(data) {
    const obj = Object.entries(data).map(book => {
        return { Topic: book }
    })

    return { Results: obj }
}

export function calculatePreferences(data) {
    const books = data.Results.map(topic => topic.Topic[1][0].Books.length)
    const totalBooks = books.reduce((count, value) => count + value, 0);

    const dataWithAverages = data.Results.map((topic, index) => {
        topic.preference = calculateAverage(books[index], totalBooks)
        return data.Results[index] = topic
    })

    return dataWithAverages
}

export function sortBooks(books) {
    const sortedBooks = books.sort((a, b) => b.preference - a.preference)
    return {Results: sortedBooks}
}

function calculateAverage(number, total) {
    return Math.floor(number / total * 100);
}

function getBooksPerCategory(data) {
    return data.map(category => category.results)
}

function mergeCategories(categories) {
    return [].concat(...categories)
}

function shuffleList(booksList) {
    // https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4
    return booksList
        .map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1]);
}