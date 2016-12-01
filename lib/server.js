'use strict'
let colors = require('colors')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let cors = require('cors')
let express = require('express')

module.exports = function callee () {
    let self = this
    var config = self.config
    self.app = express()
    if (config.CORS) {
        self.app.use(cors())
    }
    self.app.use(cookieParser())
        .use(bodyParser.urlencoded({
            extended: false,
            limit: "10240000kb"
        }))
        .use(bodyParser.json())

    config.connect.forEach(function (item) {
        app.use(item)
    })

    if (config.autoListen) {
        self.listen()
    }
}
