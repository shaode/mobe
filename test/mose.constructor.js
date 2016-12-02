var supertest = require('supertest')
var req = require('request')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
var assert = chai.assert
var mose = require('../index')
var path = require('path')

describe('mose.constructor.js', function() {
    describe('# root static templatedDir', function () {
        it('default root', function () {
            var app = mose({autoListen: false})
            expect(app.config.root).to.equal(process.cwd())
        })
        it('root absoulte', function () {
            var app = mose({autoListen: false, root: __dirname})
            expect(app.config.root).to.equal(__dirname)
        })
        it('root absoulte static ./a/b', function () {
            var app = mose({autoListen: false, root: __dirname, static: './a/b'})
            expect(app.config.root).to.equal(__dirname)
            expect(app.config.static).to.equal(path.join(__dirname, './a/b'))
        })
        it('root relative', function () {
            var app = mose({autoListen: false, root: './some'})
            expect(app.config.root).to.equal(path.join(process.cwd(), './some'))
        })
        it('root relative static ./1/2' , function () {
            var app = mose({autoListen: false, root: './some', static: './1/2'})
            expect(app.config.root).to.equal(path.join(process.cwd(), './some'))
            expect(app.config.static).to.equal(path.join(process.cwd(), './some', './1/2'))
        })
        it('default static', function () {
            var app = mose({autoListen: false})
            expect(app.config.static).to.equal(path.join(process.cwd(), './'))
        })
        it('static ./output', function () {
            var app = mose({autoListen: false, static: './output'})
            expect(app.config.static).to.equal(path.join(process.cwd(), './output'))
        })
        it('static __dirname', function () {
            var app = mose({autoListen: false, static: __dirname})
            expect(app.config.static).to.equal(__dirname)
        })
        it('default render.templatedDir', function () {
            var app = mose({autoListen: false})
            expect(app.config.render.templatedDir).to.equal(path.join(process.cwd(), './'))
        })
        it('render.templatedDir ./output', function () {
            var app = mose({autoListen: false, render:{templatedDir: './output'}})
            expect(app.config.render.templatedDir).to.equal(path.join(process.cwd(), './output'))
        })
        it('render.templatedDir __dirname', function () {
            var app = mose({autoListen: false, render:{templatedDir: __dirname}})
            expect(app.config.render.templatedDir).to.equal(__dirname)
        })
    })
    describe('# read', function () {
        it('read uniq', function () {
            expect(
                JSON.stringify(
                    mose({read: ['./view', './some', './view']}).config.read
                )
            ).to.equal('["./view","./some"]')
        })
    })
})
