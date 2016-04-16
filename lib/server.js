'use strict'
var colors = require('colors')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var http = require('http')
var cors = require('cors')
var route = require('./route')
var startlog = function(config) {
    if (config._oldPort) {
        console.log(('Port: ' + config._oldPort + ' eaddrinuse Switch port: ' + config.port).yellow)
    }
    console.log('[' + config.name + '] Running at ' + ('http://127.0.0.1:' + config.port).cyan)
    console.log('static: ' + config.static.cyan)
}


var oSuccessMsgTimer

module.exports = function callee(self) {
    var config = self._config
    var server
    var app = require('express')()    
    if (config.CORS) {
        app.use(cors())
    }
    app.use(cookieParser())
        .use(bodyParser.urlencoded({
            extended: false
        }))
        .use(bodyParser.json())
        // 提取 在浏览器中可视化操作的 cookie
        .use(function(req, res, next) {
            if (req.cookies.fms) {
                req.cookies.fms = JSON.parse(req.cookies.fms)
            } else {
                req.cookies.fms = {}
            }
            next()
        })
        .use(config.connect)
        .use(route(self))
    server = http.createServer(app).listen(config.port)
        // 延迟显示启动成功提示，如果 server 端口被占用则取消当前提示
    oSuccessMsgTimer = setTimeout(function() {
        startlog(config)
    }, 0)
    server.on('error', function(err) {
        clearTimeout(oSuccessMsgTimer)
        if (err.code === 'EADDRINUSE') {
            config._oldPort = config.port
            config.port = config.port + 1
            callee(self)
        } else {
            throw err
        }
    })
    self.app = app
    self.server = server
}