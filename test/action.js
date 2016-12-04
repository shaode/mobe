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
        it('Please change match || type || url', function (done) {
            try{
                action.add({
                    url: '/actions.add.test1',
                    type: 'get',
                    title: '获取全部新闻',
                    match: {
                        get: {
                            type: 'all'
                        }
                    }
                })
                action.add({
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
            action.add({
                url: '/actions.add.test2',
                type: 'get',
                title: '获取全部新闻',
                match: {
                    get: {
                        type: 'all'
                    }
                }
            })
            action.add({
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
            action.add({
                url: '/actions.add.test3',
                type: 'get',
                title: '登录'
            })
            action.add({
                url: '/actions.add.test3',
                type: 'post',
                title: '登录'
            })
            done()
        })
        it('url !== url ,type === type, title === title', function (done) {
            action.add({
                url: '/actions.add.test4',
                type: 'get',
                title: '登录'
            })
            action.add({
                url: '/actions.add.test4444444',
                type: 'get',
                title: '登录'
            })
            done()
        })
    })
})
