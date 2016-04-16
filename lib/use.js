var _util = require('./util')
var _ = require('underscore')
var use = function(settings, type, fn) {
    var self = this
    var url =  settings.url
    var method = settings.type.toUpperCase()
    self._handlers[url] = self._handlers[url] || {}

    // ['/url/', 'ajax'] ['/url/', 'view'] 
    _util.namespace([url, type], self._handlers)
        // ['/url/']['ajax']['POST']
        // ['/url/']['view']['GET']

    if (self._handlers[url][type][method]) {
        console.log('------- Trace -------'.grey)
        console.trace('$.' + type + ' ' + url + method + ' is exist!')
        console.log('--------------------'.grey)
        console.log('$.' + type + ' ' + method + ' ' + url.yellow + ' is exist!'.red)
        console.log('--------------------'.grey)
        throw 'url is exist!'
    }

    self._handlers[url][type] = self._handlers[url][type] || {}
        // ['/url/']['view']['GET']

    self._handlers[url][type][method] = fn
    self._handlers[url][type][method].title = settings.title || ''
    var res = []
        // 为了支持 fms.ajax fms.view 链式调用能传递 res ，需要延迟记录数据
    setTimeout(function() {
        _.each(settings.res, function(value, key) {
            res.push(key)
        })
        self._handlers[url][type][method].res = res
    }, 0)
}
module.exports = use