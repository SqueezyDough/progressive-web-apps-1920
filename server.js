'use strict';

const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const router = require('./routes/index.routes')
const minifyHTML = require('express-minify-html-2');
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000;

require("dotenv").config();

app
    .use("/", express.static(path.join(__dirname, "public")))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .set('view engine', 'hbs')
    .engine('hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'main',
        partialsDir: path.join(__dirname, 'views/partials')
    }))
    .use(minifyHTML({
        override: true,
        exception_url: false,
        htmlMinifier: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            minifyJS: true
        }
    }))
    .use('/', router)
    .listen(port, () => console.log(`Listening on port ${port}!`))