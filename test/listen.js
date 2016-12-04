var supertest = require('supertest')
var req = require('request')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
var assert = chai.assert
var mose = require('../index')
var portfinder = require('../lib/vendor/portfinder')

describe('listen.js', function() {
    describe('# listen', function () {
        it('default listen', function (done) {
            var app
            portfinder.getPort(function (err, port) {
                app = mose({port: port})
                req('http://127.0.0.1:' + app.config.port + '/______nothisurl', function (error, response, body) {
                    if (error) {
                        throw error
                    }
                    expect(body).to.equal('Cannot GET /______nothisurl\n')
                    done()
                })
            })
        })
        it('listen:true', function (done) {
            var app
            portfinder.getPort(function (err, port) {
                app = mose({port: port, listen: true})
                req('http://127.0.0.1:' + app.config.port + '/______nothisurl', function (error, response, body) {
                    if (error) {
                        throw error
                    }
                    expect(body).to.equal('Cannot GET /______nothisurl\n')
                    done()
                })
            })
        })
        it('listen:false', function (done) {
            var app
            portfinder.getPort(function (err, port) {
                app = mose({port: port, listen: false})
                req('http://127.0.0.1:' + app.config.port + '/______nothisurl', function (error, response, body) {
                    if (error) {
                        if (/connect ECONNREFUSED 127\.0\.0\.1/.test(error.message)) {
                            done()
                            return
                        }
                        throw error
                    }
                })
            })
        })
    })
})
