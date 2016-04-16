var supertest = require('supertest')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
var assert = chai.assert

describe('server.js', function() {
    describe('# cookies default req.cookies.fms', function() {
        var app = require('../')()
        it('should renturn "{}"', function(done) {
            app.app.get('/test_cookie-fms.js_1/', function(req, res) {
                res.json(req.cookies.fms)
            })
            supertest(app.app)
                .get('/test_cookie-fms.js_1/')
                .expect('{}')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
    })

    describe('# POST', function() {
        var app = require('../')({
            connect: function(req, res, next) {
                if (req.url === '/demo1/') {
                    res.send("demo1")
                } else {
                    next()
                }
            }
        })
        it('should renturn {\"POST\":true}', function(done) {
            app.app.use('/post/', function(req, res) {
                res.json(req.body)
            })
            supertest(app.app)
                .post('/post/')
                .send({
                    POST: true
                })
                .expect('{"POST":true}')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('should renturn {"POST":"JSON"}', function(done) {
            app.app.use('/post2/', function(req, res) {
                res.json(req.body)
            })
            supertest(app.app)
                .post('/post2/')
                .set('Content-Type', 'application/json')
                .send({
                    POST: "JSON"
                })
                .expect('{"POST":"JSON"}')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('config.connect', function(done) {
            supertest(app.app)
                .get('/demo1/')
                .expect('demo1')
                .end(function(err, res) {
                    if (err) return done(err)

                    supertest(app.app)
                        .get('/demo2/')
                        .expect('Cannot GET /demo2/\n')
                        .end(function(err, res) {
                            if (err) return done(err)
                            done()
                        })

                })
        })
    })

    describe('# CORS', function() {
        ;(function () {
            var app = require('../')()
            it('CORS open | access-control-allow-origin: *', function(done) {
                supertest(app.app)
                    .get('/')
                    .end(function(err, res) {
                        if (err) return done(err)
                        if (res.headers['access-control-allow-origin'] === '*') {
                            done()
                        }
                    })
            })
        })()
        ;(function () {
            var app = require('../')({
                CORS: false
            })
            it('CORS close | access-control-allow-origin: undefined', function(done) {
                supertest(app.app)
                    .get('/')
                    .end(function(err, res) {
                        if (err) return done(err)
                        if (typeof res.headers['access-control-allow-origin'] === 'undefined') {
                            done()
                        }
                    })
            })
        })()
    })
})