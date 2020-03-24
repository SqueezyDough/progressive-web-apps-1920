'use strict';

const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const router = require('./routes/index.routes')
const minifyHTML = require('express-minify-html-2')
const compression = require('compression')
const bodyParser = require('body-parser')


const app = express()
const port = process.env.PORT || 3000;

require("dotenv").config();

app
    .use("/", express.static(path.join(__dirname, "public")))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    // .use(compression({ filter: shouldCompress }))
    .set('view engine', 'hbs')
    .engine('hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'main',
        partialsDir: path.join(__dirname, 'views/partials')
    }))
    // .use(minifyHTML({
    //     override: true,
    //     exception_url: false,
    //     htmlMinifier: {
    //         removeComments: true,
    //         collapseWhitespace: true,
    //         collapseBooleanAttributes: true,
    //         removeAttributeQuotes: true,
    //         removeEmptyAttributes: true,
    //         minifyJS: true
    //     }
    // }))
    .use('/', router)
    .listen(port, () => console.log(`Listening on port ${port}!`))

// function shouldCompress (req, res) {
//     if (req.headers['x-no-compression']) {
//         // don't compress responses with this request header
//         return false
//     }

//     // fallback to standard filter function
//     return compression.filter(req, res)
// }