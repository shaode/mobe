require('babel-polyfill')
require('babel-core/register')
require('colors')
import router from "./router"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
const server = function () {
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
        self.app.use(item)
    })
    self.app.use(router)
    if (config.listen) {
        self.listen()
    }
}

export default server
module.exports = server
