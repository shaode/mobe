var $ = require('../index')
var fs = require('fs')
var path = require('path')
var supertest = require('supertest')
require('should')

describe('#RESTful', function() {
    $.run()
    $.ajax({
        type: 'get',
        url: '/user/:id',
        res: {
            ok: {
                status: "success",
                msg: "GET success"
            },
            err: "GET error"
        }
    })

    $.ajax({
        type: 'post',
        url: '/user/:id',
        res: {
            ok: {
                status: "success",
                msg: "POST success"
            },
            err: 'POST error'
        }
    })
    var server = supertest($.app)
    it('should return  GET success', function(done) {
            server
            .get('/user/1')
            .expect('{"status":"success","msg":"GET success"}')
            .expect(200, done)
    })
    it('should return  GET error', function(done) {
            server
            .get('/user/1')
            .set('Cookie', 'fms={%22/user/:id%22:{%22ajax%22:{%22GET%22:%22err%22}}}')
            .expect('GET error')
            .expect(200, done)
    })
    it('should return  POST success', function(done) {
            server
            .post('/user/1')
            .expect('{"status":"success","msg":"POST success"}')
            .expect(200, done)
    })
    it('should return  POST error', function(done) {
            server
            .post('/user/1')
            .set('Cookie', 'fms={%22/user/:id%22:{%22ajax%22:{%22POST%22:%22err%22}}}')
            .expect('POST error')
            .expect(200, done)
    })
})