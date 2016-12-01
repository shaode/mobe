var supertest = require('supertest')
var req = require('request')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
var assert = chai.assert
var mose = require('../index')
var portfinder = require('../lib/vendor/portfinder')

describe('server.js', function() {
    describe('# config.port', function () {
        it('listen port', function (done) {
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
        it('hashport default', function (done) {
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
        it('hasport "nimo"', function (done) {
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
    })
    describe('# config.CORS', function () {
        it('default open cors', function (done) {
            var app = mose({autoListen: false})
            var server = supertest(app.app)
            app.app.get('/cors/', function (req, res) {
                res.send('any text')
            })
            server
                .get('/cors/')
                .expect(200, function (err, res) {
                    if (err) return done(err);
                    var headers = res.headers;
                    assert.deepEqual(headers['access-control-allow-origin'], '*')
                    done()
                })
        })
        it('open cors', function (done) {
            var app = mose({CORS: true, autoListen: false})
            var server = supertest(app.app)
            app.app.get('/cors/', function (req, res) {
                res.send('any text')
            })
            server
                .get('/cors/')
                .expect(200, function (err, res) {
                    if (err) return done(err);
                    var headers = res.headers;
                    assert.deepEqual(headers['access-control-allow-origin'], '*')
                    done()
                })
        })
        it('close cors', function (done) {
            var app = mose({CORS: false, autoListen: false})
            var server = supertest(app.app)
            app.app.get('/cors/', function (req, res) {
                res.send('any text')
            })
            server
                .get('/cors/')
                .expect(200, function (err, res) {
                    if (err) return done(err);
                    var headers = res.headers;
                    assert.deepEqual(headers['access-control-allow-origin'], undefined)
                    done()
                })
        })
    })
    describe('# cookieParser', function () {
        it('req.cookies', function (done) {
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
        it('res.cookie', function (done) {
            var app = mose({autoListen: false})
            var server = supertest(app.app)
            app.app.get('/cookieParser/', function (req, res) {
                res.cookie('name', 'nimo')
                res.send('res.cookie')
            })
            server
               .get('/cookieParser/')
               .end(function(err, res){
                    var val = ['name=nimo; Path=/']
                    assert.deepEqual(res.headers['set-cookie'], val)
                    done()
              })
        })
    })
    describe('# bodyParser', function () {
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
