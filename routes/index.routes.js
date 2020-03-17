const express = require('express')
const router = express.Router()
const home = require('../controllers/home.controller')
const render = require('../controllers/render.controller')

router.get('/', home.init)

module.exports = router