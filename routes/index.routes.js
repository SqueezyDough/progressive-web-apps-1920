const express = require('express')
const home = require('../controllers/home.controller')
const render = require('../controllers/render.controller')
const router = express.Router()

router.get('/', home.init)
router.get('/offline', (req, res) => {
    res.render('/pages/offline')
    // render.renderView(res, viewName, viewName)
})

module.exports = router