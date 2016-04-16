var supertest = require('supertest')
var request = require('request')
var chai = require('chai')
var fs = require('fs')
var expect = chai.expect
var should = chai.should
var assert = chai.assert

describe('route.js', function() {
    describe('# urlRewrite', function() {
        it('/a.js => /b.js', function(done) {
            var app = require('../')({
                root: __dirname,
                static: 'static',
                urlRewrite: [
                    '/a.js', '/b.js'
                ]
            })
            supertest(app.app)
                .get('/a.js')
                .expect('// b.js')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('/ajax1/ => /ajax2/', function(done) {
            var app = require('../')({
                urlRewrite: [
                    '/ajax1/', '/ajax2/'
                ]
            })
            app.ajax({
                url: '/ajax1/',
                res: {
                    ok: 'ajax1'
                }
            })
            app.ajax({
                url: '/ajax2/',
                res: {
                    ok: 'ajax2'
                }
            })
            supertest(app.app)
                .get('/ajax1/')
                .expect('ajax2')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('**.js => 1.js', function (done) {
            var app = require('../')({
                root: __dirname,
                static: 'static',
                urlRewrite: [
                    /.*\.js/, '/1.js'
                ]
            })
            supertest(app.app)
                .get('/a.js')
                .expect('// 1.js')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
    })
    describe('# combo url', function() {
        it('"/??a.js,b.js" should return "// a.js // b.js"', function (done) {
            var app = require('../')({
                root: __dirname,
                static: 'static',
                port: 6432
            })
            supertest(app.app)
                .get('/??a.js,b.js')
                .expect('// a.js\n// b.js')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })

        it('"/static/??a.js,b.js" should return "// a.js // b.js"', function (done) {
            var app = require('../')({
                root: __dirname,
                port: 9123
            })
            request('http://127.0.0.1:' + app._config.port + '/static/??a.js,b.js', function (err, response, body) {
                if (err) {throw err}
                expect(body).to.equal('// a.js\n// b.js')
                done()
            })
        })
    })
    describe('# combo url', function() {
        it('"/" should return file:index.html', function (done) {
            var indexhtml = fs.readFileSync(__dirname + '/../lib/static/console.html').toString()
            var app = require('../')()
            supertest(app.app)
                .get('/')
                .expect(indexhtml)
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('ajax:/ => ok', function (done) {
            var app = require('../')()
            app.ajax({
                url: '/',
                res: {
                    ok: 'ok'
                }
            })
            supertest(app.app)
                .get('/')
                .expect('ok')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('"/" should return "index"', function (done) {
            var indexhtml = fs.readFileSync(__dirname + '/../lib/static/console.html').toString()
            var app = require('../')()
            app._handlers['/'] = function (req, res) {
                res.send("index")
            }
            supertest(app.app)
                .get('/')
                .expect("index")
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
    })
})