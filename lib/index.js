require('babel-polyfill')
require('babel-core/register')
require('colors')
import extend  from 'extend'
import path from "path"
import _ from "underscore"
import server from "./server"
import hashToPort from "hash-to-port"
import pathIsAbsolute from "path-is-absolute"
class Mose {
    constructor (conf) {
        conf = conf || {}
        const self = this
        let defaultConf = require('./config')()
        self.config = extend(true, defaultConf, conf)
        self.actions = {}
        self.data = {
            doc: []
        }
        // 操作系统路径兼容
        self.config.root = path.join(self.config.root)
        if (!pathIsAbsolute(self.config.root)) {
            self.config.root = path.join(process.cwd(), self.config.root)
        }
        if (!pathIsAbsolute(self.config.static)) {
            self.config.static = path.join(self.config.root, self.config.static)
        }
        if (!pathIsAbsolute(self.config.render.templatedDir)) {
            self.config.render.templatedDir = path.join(self.config.root, self.config.render.templatedDir)
        }
        self.config.read = _.uniq(self.config.read)
        self.config.port = this.config.port || hashToPort(self.config.name)
        self.server()
    }
}
Mose.prototype.server = require('./server')
Mose.prototype.listen = require('./listen')
const mose = function (conf) {
    return new Mose(conf)
}
module.exports = mose
export default mose
