'use strict'

var combo = require('connect-combo')
var _ = require('underscore')

module.exports = function (self) {
    return function(req, res, next) {
        var handlers = self._handlers
        var config = self._config
        var pathname = req.path

        // urlRewrite
        var i = 0
        for (; i < config.urlRewrite.length; i = i + 2) {
            var searchValue = config.urlRewrite[i]
            var replaceValue = config.urlRewrite[i + 1]
            if (typeof searchValue === 'string') {
                // "/_console/" = "\/_console\/"
                searchValue = searchValue.replace(/([.$^{[(|)*+?\/\\])/g, '\\$1')
                searchValue = new RegExp('^' + searchValue + '$')
            }
            pathname = pathname.replace(searchValue, replaceValue)
        }
        // url combo        
        var isCombo = false
        for (var key in req.query) {
            if (key[0] === '?') {
                isCombo = true
            }
        }
        if (isCombo) {
            combo({
                directory: config.static,
                proxy: false,
                cache: true,
                log: true,
                static: true
            })(req, res)
            return false
        }
        if (pathname === '/') {
            // View 中未配置 url 为 '/' 的模拟模板渲染
            if (!handlers['/']) {
                handlers['_index'](req, res, next)
                return
            }
        }
        var handler = handlers[pathname]

        switch (typeof handler) {
            case 'function':
                handler(req, res, next)
                break
            case 'object':
                var type
                if (req.xhr) {
                    type = 'ajax'
                } else if (!_.isEmpty(handler['view'])) {
                    type = 'view'
                }
                // 当没有 view 存在时使用 ajax 的 function 因为偶尔需要直接打开 url 查看 GET 方式 AJAX 的响应内容
                else {
                    type = 'ajax'
                }

                if (handler[type]) {
                    // handler['ajax']['get']
                    if (handler[type][req.method]) {
                        handler[type][req.method](req, res, next)
                    } else {
                        next()
                    }
                } else {
                    next()
                }
                break
            default:
                handlers['_static'](req, res, next, pathname)
        }
    }
}