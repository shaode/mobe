'use strict'
var Class = require('arale-class')
require('colors')
var Fms = Class.create({
    initialize: require('./initialize'),
    run: require('./run'),
    use: require('./use'),
    close: require('./close'),
    ajax: require('./ajax'),
    view: null,
    doc: require('./doc').doc,
    docFile: require('./doc').docFile,
    _server: require('./server')
})

var output = function (config) {
    return new Fms(config)
}
output.run = function () {
    // 0.1.0 以前的版本不需要 `()` 所以给出提示，但因为 0.1.0 之前都是国内用户使用，所以只需要给出中文提示
    throw '请使用: var app = require("fms")({port: 3000}) 引用 fms'
}
global.FMSutil = require('./util')
module.exports = output