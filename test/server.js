var supertest = require('supertest')
var req = require('request')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
var assert = chai.assert
var mobe = require('../index')
var portfinder = require('../lib/vendor/portfinder')

describe('server.js', function() {
    describe('# basic server run', function () {
        it('# "/" should return "Cannot GET /"', function (done) {
            var app
            portfinder.getPort(function (err, port) {
                app = mobe({port: port})
                req('http://127.0.0.1:' + app.config.port, function (error, response, body) {
                    if (error) {
                        throw error
                    }
                    expect(body).to.equal('Cannot GET /\n')
                    done()
                })
            })
        })
        it('# server should not listen port', function (done) {
            var app
            portfinder.getPort(function (err, port) {
                app = mobe({port: port, autoListen: false})
                req('http://127.0.0.1:' + app.config.port, function (error, response, body) {
                    expect(error.message).to.equal('connect ECONNREFUSED')
                    done()
                })
            })
        })
        it('# timeout start listen', function (done) {
            var app
            portfinder.getPort(function (err, port) {
                app = mobe({port: port, autoListen: false})
                req('http://127.0.0.1:' + app.config.port, function (error, response, body) {
                    expect(error.message).to.equal('connect ECONNREFUSED')
                })
                setTimeout(function () {
                    app.listen()
                    req('http://127.0.0.1:' + app.config.port, function (error, response, body) {
                        if (error) {
                            throw error
                        }
                        expect(body).to.equal('Cannot GET /\n')
                        done()
                    })
                }, 1000)

            })
        })
        it('# timeout start listen,buy listen existing & switch random port', function (done) {
            var app
            portfinder.getPort(function (err, port) {
                app = mobe({port: port, autoListen: false})
                req('http://127.0.0.1:' + app.config.port, function (error, response, body) {
                    expect(error.message).to.equal('connect ECONNREFUSED')
                })
                setTimeout(function () {
                    // other server use port
                    mobe({port: port})
                    app.listen()
                    setTimeout(function () {
                        expect(app.config.port).not.equal(port)
                        req('http://127.0.0.1:' + app.config.port, function (error, response, body) {
                            if (error) {
                                throw error
                            }
                            expect(body).to.equal('Cannot GET /\n')
                            done()
                        })
                    }, 500)
                }, 1000)

            })
        })
    })
})
