const api = require('./api.controller')
const render = require('./render.controller')
require("dotenv").config();

exports.init = function(req, res) {
    api.FetchData()
        .then(data => {
            console.log(data)

            const viewName = 'home'
            const viewData = {
                app: process.env.NAME,
                books: data.results
            }

            render.renderView(res, viewName, viewData)
        })
}
