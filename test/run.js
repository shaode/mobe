var supertest = require('supertest')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
var assert = chai.assert

describe('run.js', function() {
    describe('# config.root add "/"', function() {
        var app = require('../')({
            root: '/user',
            static: 'static'
        })

        var config = app._config
        it('"/user" + "static" should renturn "/user/statc"', function() {
            expect(config.static).to.equal('/user/static')
        })
    })
    describe('# config.read add "/"', function() {
        var config = require('../')({
            read: ['/']
        })._config

        it('read should renturn ["/"]', function() {
            expect(config.read).to.eql(['/'])
        })
        var config2 = require('../')({
            read: ['view']
        })._config
        it('"read should renturn ["view","/"]', function() {
            expect(config2.read).to.eql(['view', '/'])
        })

    })
    describe('# config.port', function() {
        var app = require('../')({
            port: 5342
        })
        var config = app._config
        app.close()
        it('port should return 5342', function() {
            expect(config.port).to.eql(5342)
        })
    })
    describe('# default config', function() {
        var app = require('../')()
        var config = app._config
        it('should eql config.js', function() {
            var defaultConfig = require('../lib/config')()
                // 下面这些配置都是 run 处理过的，所以不需要一致
            defaultConfig.read = config.read
            defaultConfig.static = config.static
            defaultConfig._projectName = config._projectName
            defaultConfig._oldPort = config._oldPort
            defaultConfig.root = config.root
                // port 会被 server 处理
            defaultConfig.port = config.port

            expect(config).to.eql(defaultConfig)
        })
    })
})