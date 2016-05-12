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
        it('# listen server', function (done) {
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
    })
})
