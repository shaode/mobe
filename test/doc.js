var supertest = require('supertest')
var request = require('request')
var chai = require('chai')
var fs = require('fs')
var expect = chai.expect
var should = chai.should
var assert = chai.assert
var _util = require('./util')

describe('doc.js', function () {
    describe('# doc()', function () {
            var app = require('../')('doc')
            app.docFile('./test/.doc.html')

            app.doc('**some**like')
            app.doc(function(){/*!
    > Nimo love Judy
                */})
            app.doc({nimo:24})
            app.doc('@Sort1')
            app.ajax({
                url: '/ajaxdocsort/',
                res: {
                    ok: 1,
                    err: 23531251
                }
            })
            app.doc('@Sort2')
            // 因为 docFile 是延迟生成的，所以需要延迟读取校验
            var doc = app._data.doc.join('\n')
            it('doc(String)', function (done) {
                if (doc.indexOf('<p><strong>some</strong>like</p>') > -1) {
                    done()
                }
            })
            it('doc(Function)', function (done) {
                if (doc.indexOf('<blockquote>\n<p>Nimo love Judy</p>\n</blockquote>') > -1) {
                    done()
                }
            })
            it('doc(Object)', function (done) {
                if (doc.indexOf('<span class="hljs-string">"nimo"</span>: <span class="hljs-number">24</span>\n}\n</code></pre>') > -1) {
                    done()
                }
            })
            it('doc() sort', function (done) {
                if (doc.indexOf('<p>@Sort1</p>\n\n<p><a href="#/ajaxdocsort') > -1) {
                    if (doc.indexOf('<pre><code class="lang-js"><span class="hljs-number">23531251</span>\n</code></pre>\n\n<p>@Sort2</p>') > -1) {
                        done()
                    }
                }
            })
    })
})