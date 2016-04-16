var supertest = require('supertest')
var request = require('request')
var chai = require('chai')
var fs = require('fs')
var expect = chai.expect
var should = chai.should
var assert = chai.assert
var _util = require('./util')


describe('ajax.js', function() {
    describe('# ajax(url, settings)', function() {
        it('should return "a"', function(done) {
            var app = require('../')()
            app.ajax('/demo/', {
                res: {
                    ok: 'a'
                }
            })
            supertest(app.app)
                .get('/demo/')
                .expect('a')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('ajax "/"', function(done) {
            var app = require('../')()
            app.ajax('/', {
                res: {
                    ok: 1,
                    err: 2
                }
            })
            supertest(app.app)
                .get('/')
                .expect('1')
                .end(function(err, res) {
                    if (err) return done(err)
                    supertest(app.app)
                        .get('/')
                        .set('Cookie', _util.res('/`ajax`get`err'))
                        .expect('2')
                        .end(function(err, res) {
                            if (err) return done(err)
                            done()
                        })
                })
        })
        it('extend default settings', function(done) {
            var app = require('../')('default settings')
            app.ajax({
                url: '/a/'
            })
            var config = require('../lib/config')()
            supertest(app.app)
                .get('/a/')
                .expect(JSON.stringify(config.ajax.res.ok))
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
    })
    describe('# ajax res all type', function() {
        it('res string', function(done) {
            var app = require('../')()
            app.ajax('/demo/', {
                res: {
                    ok: 'a',
                    err: 'b'
                }
            })
            supertest(app.app)
                .get('/demo/')
                .expect('a')
                .end(function(err, res) {
                    if (err) return done(err)
                    supertest(app.app)
                        .get('/demo/')
                        .set('Cookie', _util.res('/demo/`ajax`get`err'))
                        .expect('b')
                        .end(function(err, res) {
                            if (err) return done(err)
                            done()
                        })
                })
        })
        it('res number', function(done) {
            var app = require('../')()
            app.ajax('/demo/', {
                res: {
                    ok: 1,
                    err: 2
                }
            })
            supertest(app.app)
                .get('/demo/')
                .expect('1')
                .end(function(err, res) {
                    if (err) return done(err)
                    supertest(app.app)
                        .get('/demo/')
                        .set('Cookie', _util.res('/demo/`ajax`get`err'))
                        .expect('2')
                        .end(function(err, res) {
                            if (err) return done(err)
                            done()
                        })
                })
        })
        it('res true', function(done) {
            var app = require('../')()
            app.ajax('/demo/', {
                res: {
                    ok: true
                }
            })
            supertest(app.app)
                .get('/demo/')
                .expect('true')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('res false', function(done) {
            var app = require('../')()
            app.ajax('/demo/', {
                res: {
                    ok: true,
                    err: false
                }
            })
            supertest(app.app)
                .get('/demo/')
                .set('Cookie', _util.res('/demo/`ajax`get`err'))
                .expect('true')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('res array', function(done) {
            var app = require('../')()
            app.ajax('/demo/', {
                res: {
                    ok: ['a'],
                    err: ['b']
                }
            })
            supertest(app.app)
                .get('/demo/')
                .expect('["a"]')
                .end(function(err, res) {
                    if (err) return done(err)
                    supertest(app.app)
                        .get('/demo/')
                        .set('Cookie', _util.res('/demo/`ajax`get`err'))
                        .expect('["b"]')
                        .end(function(err, res) {
                            if (err) return done(err)
                            done()
                        })
                })
        })
        it('res object', function(done) {
            var app = require('../')()
            app.ajax('/demo/', {
                res: {
                    ok: {
                        a: 1
                    },
                    err: {
                        b: 2
                    }
                }
            })
            supertest(app.app)
                .get('/demo/')
                .expect('{"a":1}')
                .end(function(err, res) {
                    if (err) return done(err)
                    supertest(app.app)
                        .get('/demo/')
                        .set('Cookie', _util.res('/demo/`ajax`get`err'))
                        .expect('{"b":2}')
                        .end(function(err, res) {
                            if (err) return done(err)
                            done()
                        })
                })
        })
        it('res jsonp', function(done) {
            var app = require('../')()
            app.ajax('/demo/', {
                res: {
                    ok: {
                        a: 1
                    },
                    err: {
                        b: 2
                    }
                },
                dataType: 'jsonp'
            })
            supertest(app.app)
                .get('/demo/?callback=demoabc')
                .expect("/**/ typeof demoabc === \'function\' && demoabc({\"a\":1});")
                .end(function(err, res) {
                    if (err) return done(err)
                    supertest(app.app)
                        .get('/demo/?callback=a')
                        .set('Cookie', _util.res('/demo/`ajax`get`err'))
                        .expect('/**/ typeof a === \'function\' && a({\"b\":2});')
                        .end(function(err, res) {
                            if (err) return done(err)
                            done()
                        })
                })
        })
    })
    it('res function', function(done) {
        var app = require('../')()
        app.run()
        app.ajax('/demo/', {
            res: {
                ok: function(req, res) {
                    return {
                        name: req.query.name
                    }
                },
                err: function(req, res) {
                    res.send('err')
                }
            }
        })
        supertest(app.app)
            .get('/demo/?name=nimo')
            .expect('{"name":"nimo"}')
            .end(function(err, res) {
                if (err) return done(err)
                supertest(app.app)
                    .get('/demo/')
                    .set('Cookie', _util.res('/demo/`ajax`get`err'))
                    .expect('err')
                    .end(function(err, res) {
                        if (err) return done(err)
                        done()
                    })
            })
    })
    it('res mockjs template', function(done) {
        var app = require('../')()
        app.run()
        app.ajax('/demo/', {
            res: {
                ok: {
                    "name|1": "★"
                },
                err: {
                    "name|2": "x"
                }
            }
        })
        supertest(app.app)
            .get('/demo/')
            .expect('{"name":"★"}')
            .end(function(err, res) {
                if (err) return done(err)
                supertest(app.app)
                    .get('/demo/')
                    .set('Cookie', _util.res('/demo/`ajax`get`err'))
                    .expect('{"name":"xx"}')
                    .end(function(err, res) {
                        if (err) return done(err)
                        done()
                    })
            })
    })
    describe('# checkUrl', function() {
        it('settings.url is empty!', function(done) {
            var app = require('../')()
            try {
                app.ajax({
                    res: {
                        ok: 'a'
                    }
                })
            } catch (err) {
                if (err === 'settings.url is empty!') {
                    done()
                }
            }
        })
        it('trim left url', function(done) {
            var app = require('../')()
            app.ajax({
                type: 'get',
                url: '  /a/',
                res: {
                    ok: 1
                }
            })
            supertest(app.app)
                .get('/a/')
                .expect('1')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('trim right url', function(done) {
            var app = require('../')()
            app.ajax({
                type: 'get',
                url: '/a/  ',
                res: {
                    ok: 2
                }
            })
            supertest(app.app)
                .get('/a/')
                .expect('2')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('trim url', function(done) {
            var app = require('../')()
            app.ajax({
                type: 'get',
                url: '   /a/  ',
                res: {
                    ok: 3
                }
            })
            supertest(app.app)
                .get('/a/')
                .expect('3')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
        it('prepend url', function(done) {
            var app = require('../')()
            app.ajax({
                type: 'get',
                url: 'a',
                res: {
                    ok: 'ok'
                }
            })
            supertest(app.app)
                .get('/a')
                .expect('ok')
                .end(function(err, res) {
                    if (err) return done(err)
                    done()
                })
        })
    })
    describe('# control ajax response', function () {
        var app = require('../')({
            ajax: {
                res: {
                    ok: 1,
                    err: 0
                }
            }
        })
        app.ajax({
            url: '/demo/',
            res: {
                wait: 'wait'
            }
        })
        it('ok', function (done) {
            supertest(app.app)
            .get('/demo/')
            .expect('1')
            .end(function(err, res) {
                if (err) return done(err)
                done()
            })
        })
        it('err', function (done) {
            supertest(app.app)
            .get('/demo/')
            .set('Cookie', _util.res('/demo/`ajax`get`err'))
            .expect('0')
            .end(function(err, res) {
                if (err) return done(err)
                done()
            })
        })
        it('wait', function (done) {
            supertest(app.app)
            .get('/demo/')
            .set('Cookie', _util.res('/demo/`ajax`get`wait'))
            .expect('wait')
            .end(function(err, res) {
                if (err) return done(err)
                done()
            })
        })
    })
})