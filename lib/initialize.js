module.exports = function (config) {
    var self = this
    self._config = {}    
    self._handlers = {
    /*
        '/function/': function(req, res) {},
        '/user/': {
            ajax: {
                "GET": fn,
                "POST": fn,
                "PUT": fn,
                "DELETE": fn
            },
            view: {
                'GET': fn,
                'POST': fn
            }
        }
    */
    }
    // handlebars 编译后的渲染函数
    self._render = {
        // ./ejs/static.ejs
        // staticList: fn
        // ajaxDocument
    }

    // 一些数据集合
    self._data = {
        doc: []
    }
    self.run(config)
}