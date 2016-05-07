'use strict'
let colors = require('colors')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let cors = require('cors')
let express = require('express')

let route = require('./route')

module.exports = function callee () {
    let self = this
    var config = self.config
    self.app = express()
    if (config.CORS) {
        self.app.use(cors())
    }
    self.app.use(cookieParser())
        .use(bodyParser.urlencoded({
            extended: false
        }))
        .use(bodyParser.json())
        .use(config.connect)

    if (config.autoListen) {
        self.listen()
    }
}
