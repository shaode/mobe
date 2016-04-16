'use strict'
var colors = require('colors')
var extend = require('extend')
var _ = require('underscore')
var path = require('path')
var run = function(settings) {
    var self = this
    var defaultConfig = require('./config')()

    extend(true, defaultConfig, settings)
    var config = defaultConfig

    // 操作系统路径兼容
    config.static = path.join(config.static)
    config.root = path.join(config.root)

    // (windows "\" unix  "/")
    var rDirPath = /(\/|\\)$/
        // 给 root 追加 "/", 防止用户配置 static: "static" 而不是 "./static"
    if (!rDirPath.test(config.root)) {
        config.root = config.root + path.join('/')
    }

    config.static = config.root + config.static

    // 始终读取项目根目录 HTML 文件
    config.read.push('/')
    config.read = _.uniq(config.read)
        // 默认读取系统配置 PORT
    config.port = process.env.PORT || config.port
    config._projectName = self._projectName
    self._config = config
    require('./initHandlers')(self)
    self._server(self)
}
module.exports = run