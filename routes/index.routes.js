const express = require('express')
const router = express.Router()
const home = require('../controllers/home.controller')

router.get('/', home.init)
router.get('/overview', home.overview)
router.post('/results', home.postResults, home.overview)
router.get('/details/:id', home.details)
router.get('/offline', home.offline)

module.exports = router