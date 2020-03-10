'use strict';

const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const router = require('./routes/index.routes')
const app = express()
const port = process.env.PORT || 3000;

require("dotenv").config();

app
    .use("/public", express.static(path.join(__dirname, "public")))
    .set('view engine', 'hbs')
    .engine('hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'main',
        partialsDir: path.join(__dirname, 'views/partials')
    }))
    .get('/', router)
    .listen(port, () => console.log(`Listening on port ${port}!`))