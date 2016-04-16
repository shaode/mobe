'use strict'
var iUtil = require('./util')
var extend = require('extend')
var colors = require('colors')
var mime =require('mime')
var ejs = require('ejs')
var _ = require('underscore')
var marked = require('marked')
var hljs = require('highlight.js')
var Mock = require('mockjs')
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


module.exports = function (url, settings) {
    var self = this    
    var config = self._config
    // 缓存模板编译结果
    if (!self._render.ajaxDocument) {
        self._render.ajaxDocument = ejs.compile(iUtil.heredoc(config.ajax.docTemplate))
    }
    settings = settings || {}
    if (typeof url === "string") {
        settings.url = url
    }
    // setings is object
    else {
        settings = url
    }

    var handler

    iUtil.filterUrl(settings)
    // url 错误时会返回 false
    if (!settings.url){
        return false
    }
    // 使用 extend copy 一份 config.ajax 防止后续 expend 扩展时候修改了 config.ajax
    var defaultSettings = extend({}, config.ajax)

    // config.ajax.res 不应该进行完全的 extend 处理
    /*
    如果 res 被完全 extend
    fms({
        ajax: {
            res: {
                a:1
            }
        }
    })
    app.ajax({
        url: '/demo/'
        res: {
            b:2
        }
    })
    /demo/ 会返回 {a:1,b:2} 而实际上我们希望他返回 {b:1}
    */

    defaultSettings.res = {}
    settings = extend(true, defaultSettings, settings)
    var key
    for (key in config.ajax.res) {
        if (typeof settings.res[key] === 'undefined') {
            settings.res[key] = config.ajax.res[key]
        }
    }
    
    /*
    如果某个属性设置为 false 则表示不需要这个状态
    我们会在 run(settings) 中配置 ajax 的默认参数
    比如某个AJAX只需要 ok 一种状态
        res: {
            ok: {
                name: 'fms'
            },
            err: false
        }
    */
    _.each(settings.res, function (value, key) {
        if (value === false) {
            delete settings.res[key]
        }
    })
    

    // post => POST , get => GET
    settings.type = settings.type.trim().toUpperCase()

    // 如果发现是 RESTful 则使用 express 的 use 添加到路由
    if (/:/.test(settings.url)) {
        var type = settings.type.toLowerCase()
        self.app[type](settings.url, function (req, res) {
            // 添加到路由后调用对应的 handlers 
            // handlers['/user/:id']
            handlers[settings.url]['ajax'][req.method](req, res)
        })
    }
    self.use(settings, 'ajax', function (req, res) {
        // settings.url 有可能是 RESTful /user/:id
        iUtil.namespace([settings.url, 'ajax'], req.cookies.fms)
        var resType = req.cookies.fms[settings.url]['ajax'][settings.type] || 'ok'
        var resBody = settings.res[resType]
        // 控制 AJAX 成功失败的 cookie 值在 res 中找不到时
        // 这种情况出现在第一次配置了 res: {a:1} 第二次启动 fms 删除了 a:1 ，但浏览器中却已经存在 COOKIE
        /*
            当 cookie 为
            COOKIE fms={'/demo/':{ajax:{'get':'haha'}}}
            时候如果不做缺省值处理会报错，因为
        */
        if (resBody === undefined) {
            var key
            for (key in settings.res) {
                // 不直接配置 resBody = settings.res['ok'] 是因为 config.ajax.res 可以自由控制默认ajax的几种结果
                resBody = settings.res[key]
            }
        }
        // 递归将 res.ok res.err 转换为字符串或 function 默认返回的 undefined
        ;(function translateResponse () {
            switch (typeof resBody) {
                case 'function':
                    resBody = resBody(req, res)
                    // responseResult could be Number Object                    
                    translateResponse()
                break
                case 'object':
                    if (settings.mockjsTemplate) {
                        // https://github.com/nuysoft/Mock/wiki/Mock.toJSONSchema()
                        resBody = Mock.mock(resBody)
                    }
                    resBody = JSON.stringify(resBody)
                break
                case 'number':
                    resBody = String(resBody)
                break
                default:
            }
        })()
        /*
        resBody = function(res, res){
            res.send('message')
        }
        resBody() === undefined
        如果 resBody 是 undefined 则表示已经使用了 res.send 之类方法 响应了请求
        @todo
        文档：当 res.some 是 function 时如果没有 res.send 没有return undefined 以外的值则会一直无响应
        */

        if (resBody !== undefined) {
            setTimeout(
                function() {
                    // 如果 config.ajax.resStatus 只配置了 ok err,而使用者使用了 res: {wait: 1,stop:2} 则会找不到 resStatus['wait']
                    settings.resStatus[resType]  = settings.resStatus[resType] || 200
                    res.status(settings.resStatus[resType])
                    if (settings.dataType === 'jsonp') {
                        res.jsonp(JSON.parse(resBody))
                    } else {
                        res.set({
                            // json ==> application/json , text ==> text/html
                            "Content-Type": mime.lookup(settings.dataType)
                        })
                        res.send(resBody)
                    }
                },
                settings.timeout
            )
        }
    })
    // doc 设置为 false 时不增加文档
    if (settings.doc !== false) {
        settings.doc = settings.doc || {}
        var docSettings = extend(true, {}, settings)
        
        docSettings = extend(true, docSettings, settings.doc)

        _.each(docSettings.res, function (value, key) {
            ;(function translateResponse () {
                switch (typeof value) {
                    case 'function':
                        try {
                            value = value()
                        }
                        catch (err) {
                            value = 'Mock Function https://github.com/nimojs/fms/issues/38'
                        }
                        translateResponse()
                    break
                    case 'object':
                        if (settings.mockjsTemplate) {
                            // https://github.com/nuysoft/Mock/wiki/Mock.toJSONSchema()
                            value = Mock.mock(value)
                        }
                        value = iUtil.formatJson(JSON.stringify(value))
                    break
                    case 'number':
                        value = String(value)
                    break
                    default:
                }
            })()
            docSettings.res[key] = value
        })

        self.doc('<a href="#' + docSettings.url + '!ajax" class="markdown-anchor" data-url="' + docSettings.url + ' "name="' + docSettings.url + '!ajax">#</a>\r\n')

        self.doc(marked(self._render.ajaxDocument(docSettings)))
    }
    // 遍历 fms.run(settings) 中的 settings.ajax.res ，根据 res 增加 fms.ajax().ok() 链式 API

    // 读取默认设置，根据默认设置添加链式 API 
    function chainedAPIWarning () {
        console.log('链式API会被弃用，详情请阅读：https://github.com/nimojs/fms/issues/36')
    }
    var oCallbackHandler = {
        ok: function (response) {
            settings.res.ok = response
            chainedAPIWarning()
            return this
        },
        err: function (response) {
            settings.res.err = response
            chainedAPIWarning()
            return this
        },
        res: function (ajaxSettingsRes) {
            settings.res = ajaxSettingsRes
            return this
        }
    }
    var key
    for (key in config.ajax.res) {
        // ok err res 已存在不添加
        if (!/^(ok|err|res)$/.test(key)) {
            (function (key){
                oCallbackHandler[key] = function (response) {
                    settings.res[key] = response
                    chainedAPIWarning()
                    return this
                }
            })(key)
        }
    }
    return oCallbackHandler
}