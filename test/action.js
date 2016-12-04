require('babel-polyfill')
require('babel-core/register')
require('colors')
var supertest = require('supertest')
var req = require('request')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
var assert = chai.assert
var mose = require("../")

describe('action.js', function() {
    describe('# renderType', function () {
        it('__renderType: ajax', function (done) {
            var app = mose({listen: false})
            app.ajax({
                type: 'get',
                url: '/some'
            })
            expect(app.actions['/some'][0].__renderType).to.equal('ajax')
            done()
        })
    })
    describe('# trim attr', function (){
        it('url should be a string', function (done) {
            var app = mose({listen: false})
            try{
                app.ajax({
                    type: 'get'
                })
            }
            catch (err) {
                expect(err.message).to.match(/app.ajax\(settings\)/)
                expect(err.message).to.match(/settings\.url should be a string/)
                done()
            }
        })
        it('type should be a string', function (done) {
            var app = mose({listen: false})
            try{
                app.ajax({
                    url: '/demo'
                })
            }
            catch (err) {
                expect(err.message).to.match(/app.ajax\(settings\)/)
                expect(err.message).to.match(/settings\.type should be a string/)
                done()
            }
        })
        it('title url type', function (done) {
            var app = mose({listen: false})
            app.ajax({
                type: '  get  ',
                url: '  /demo   ',
                title: '  some   '
            })

            expect(app.actions['/demo'][0].type).to.equal('GET')
            expect(app.actions['/demo'][0].title).to.equal('some')
            expect(app.actions['/demo'][0].url).to.equal('/demo')
            done()
        })
        it('Revise url', function (done) {
            var app = mose({listen: false})
            app.ajax({
                type: 'get',
                url: 'some'
            })
            app.ajax({
                type: 'get',
                url: '/foo'
            })
            expect(app.actions['/some'].length).to.equal(1)
            expect(app.actions['/foo'].length).to.equal(1)
            done()
        })
    })
    describe('# add', function () {
        it('Please change match || type || url', function (done) {
            var app = mose({listen:false})
            try{
                app.ajax({
                    url: '/actions.add.test1',
                    type: 'get',
                    title: '获取全部新闻',
                    match: {
                        get: {
                            type: 'all'
                        }
                    }
                })
                app.ajax({
                    url: '/actions.add.test1',
                    type: 'get',
                    title: '获取全部新闻',
                    match: {
                        get: {
                            type: 'all'
                        }
                    }
                })
            }
            catch(err) {
                expect(err.message).to.match(/Please change match \|\| type \|\| url/)
                expect(err.message).to.match(/match: \{"get":\{"type":"all"\}\}/)
                expect(err.message).to.match(/already existing/)
                done()
            }
        })
        it('url === url ,type === type, title !== title', function (done) {
            var app = mose({listen:false})
            app.ajax({
                url: '/actions.add.test2',
                type: 'get',
                title: '获取全部新闻',
                match: {
                    get: {
                        type: 'all'
                    }
                }
            })
            app.ajax({
                url: '/actions.add.test2',
                type: 'get',
                title: '获取热点新闻',
                match: {
                    get: {
                        type: 'hot'
                    }
                }
            })
            done()
        })
        it('url === url ,type !== type, title === title', function (done) {
            var app = mose({listen:false})
            app.ajax({
                url: '/actions.add.test3',
                type: 'get',
                title: '登录'
            })
            app.ajax({
                url: '/actions.add.test3',
                type: 'post',
                title: '登录'
            })
            done()
        })
        it('url !== url ,type === type, title === title', function (done) {
            var app = mose({listen:false})
            app.ajax({
                url: '/actions.add.test4',
                type: 'get',
                title: '登录'
            })
            app.ajax({
                url: '/actions.add.test4444444',
                type: 'get',
                title: '登录'
            })
            done()
        })
    })
})
