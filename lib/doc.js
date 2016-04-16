var fse = require('fs-extra')
var data = []
var iUtil = require('./util')
var marked = require('marked')
var hljs = require('highlight.js')
marked.setOptions({
    highlight: function (code, lang, callback) {
        if (lang) {
            return hljs.highlight(lang, code).value
        }
        else {
            return hljs.highlightAuto(code).value
        }
    }
})
module.exports.doc = function (content) {
    var self = this
    switch (typeof content) {
        case 'function':
        content = iUtil.heredoc(content)
        break
        case 'object':
        content = '```js\n' + iUtil.formatJson(JSON.stringify(content) + '\n```')
        break
        default:
    }
    self._data.doc.push(marked(content))
}

module.exports.docFile = function (path, cb) {
    var self = this
    var config = self._config
    // 定时是因为需要等待 app.ajax app.view app.doc 配置完成
    setTimeout(function () {
        var source = fse.readFileSync(__dirname + '/ejs/doc-html.replace').toString()
        source = source.replace('<%- content %>', self._data.doc.join('\n'))
        fse.outputFile(config.root + path, source, function (err) {
            if (err) {
                console.error('docFile Error')
                console.log(err)
            }
        })
    }, 0)
}
