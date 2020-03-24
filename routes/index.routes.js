const express = require('express')
const router = express.Router()
const home = require('../controllers/home.controller')

router.get('/', home.init)
router.post('/results', home.results)
router.get('/details/:id', home.details)
router.get('/offline', home.offline)

module.exports = router