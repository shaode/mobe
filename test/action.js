require('babel-polyfill')
require('babel-core/register')
require('colors')
var supertest = require('supertest')
var req = require('request')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
var assert = chai.assert
var action = require('../lib/action')

describe('action.js', function() {
    describe('# add', function () {
        it('Please change "title" or "type', function (done) {
            try{
                action.add({
                    url: '/news',
                    type: 'get',
                    title: '获取全部新闻',
                    match: {
                        get: {
                            type: 'all'
                        }
                    }
                })
                action.add({
                    url: '/news',
                    type: 'get',
                    title: '获取全部新闻',
                    match: {
                        get: {
                            type: 'hot'
                        }
                    }
                })
            }
            catch(err) {
                expect(err.message).to.match(/## Please change title or type/)
                expect(err.message).to.match(/match: \{"get":\{"type":"all"\}\}/)
                expect(err.message).to.match(/match: \{"get":\{"type":"hot"\}\}/)
                expect(err.message).to.match(/already existing/)
                done()
            }
        })
        it('url === url ,type === type, title !== title', function (done) {
            try{
                action.add({
                    url: '/testnews',
                    type: 'get',
                    title: '获取全部新闻',
                    match: {
                        get: {
                            type: 'all'
                        }
                    }
                })
                action.add({
                    url: '/testnews',
                    type: 'get',
                    title: '获取热点新闻',
                    match: {
                        get: {
                            type: 'hot'
                        }
                    }
                })
            }
            catch(err) {
                if(err) {throw err}
                done()
            }
        })
    })
})
