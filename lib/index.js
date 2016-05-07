'use strict'
require('colors')
let extend = require('extend')
let path = require('path')
let _ = require('underscore')
let server = require('./server')
class Mobe {
    constructor (conf) {
        conf = conf || {}
        let defaultConf = require('./config')()
        this.config = extend(true, defaultConf, conf)
        this.actions = {}
        this.data = {
            doc: []
        }
        // 操作系统路径兼容
        this.config.root = path.join(this.config.root)
        this.config.static = path.join(this.config.root, this.config.static)

        this.config.read = _.uniq(this.config.read)
        this.config.port = process.env.PORT || this.config.port
        this.server()
    }
}
Mobe.prototype.server = require('./server')
Mobe.prototype.listen = require('./listen')
// Mobe 前身是 fms ,而 fms 的启动方式需要 run 方法， Mobe 中不需要 run 所以使用中文提示
Mobe.prototype.run = function () {
    throw new Error('请使用: var app = require("mobe")({port: 3000}) 引用 mobe')
}
const mobe = function (conf) {
    return new Mobe(conf)
}
module.exports = mobe
