var supertest = require('supertest')
var req = require('request')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
var assert = chai.assert
var mose = require('../index')
var portfinder = require('../lib/vendor/portfinder')

describe('server.js', function() {
    describe('# basic server run', function () {
        it('# listen port', function (done) {
            var app
            portfinder.getPort(function (err, port) {
                app = mose({port: port})
                req('http://127.0.0.1:' + app.config.port, function (error, response, body) {
                    if (error) {
                        throw error
                    }
                    expect(body).to.equal('Cannot GET /\n')
                    done()
                })
            })
        })
        it('# listen hasport default', function (done) {
            var app
            var url = 'http://127.0.0.1:50918'
            req(url, function (error, response, body) {
                if (error) {
                    if (error.message === 'connect ECONNREFUSED 127.0.0.1:50918') {
                        done()
                        return
                    }
                    throw error
                }
                app = mose()
                req(url, function (error, response, body) {
                    if (error) {
                        throw error
                    }
                    expect(body).to.equal('Cannot GET /\n')
                    done()
                })
            })
        })
        it('# listen hasport name:nimo', function (done) {
            var app
            var url = 'http://127.0.0.1:58484'
            req(url, function (error, response, body) {
                if (error) {
                    if (error.message === 'connect ECONNREFUSED 127.0.0.1:58484') {
                        done()
                        return
                    }
                    throw error
                }
                app = mose({name: "nimo"})
                req(url, function (error, response, body) {
                    if (error) {
                        throw error
                    }
                    expect(body).to.equal('Cannot GET /\n')
                    done()
                })
            })
        })
        it('# cookieParser', function (done) {
            var app = mose({autoListen: false})
            var server = supertest(app.app)
            app.app.get('/cookieParser/', function (req, res) {
                res.send(req.cookies)
            })
            server
               .get('/cookieParser/')
               .set('Cookie', 'name=mose')
               .expect('{"name":"mose"}')
               .expect(200, done)
        })
        it('# get', function (done) {
            var app = mose({autoListen: false})
            var server = supertest(app.app)
            app.app.get('/get/', function (req, res) {
                res.send(req.query)
            })
            server
               .get('/get/?name=getmose')
               .expect('{"name":"getmose"}')
               .expect(200, done)
        })
        it('# post', function (done) {
            var app = mose({autoListen: false})
            var server = supertest(app.app)
            app.app.get('/post/', function (req, res) {
                res.send(req.query)
            })
            server
               .get('/post/?name=postmose')
               .expect('{"name":"postmose"}')
               .expect(200, done)
        })
    })
})
