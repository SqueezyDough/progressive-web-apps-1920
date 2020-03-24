init()

function init() {
    const url = window.location.href.split('/')
    const page = url[url.length -1]

    if (!navigator.onLine && !page) {
        window.location.href = "/overview";
    }
}