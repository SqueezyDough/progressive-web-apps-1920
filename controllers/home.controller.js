const api = require('../controllers/api.controller')

exports.init = function(req, res) {
    api.FetchData()
        .then(data => {
            res.render('home', {
                title: 'home',
                movies: data.results
            })
        })
        .then(data => console.log(data))
}
