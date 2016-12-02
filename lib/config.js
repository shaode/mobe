'use strict'
var extend = require("extend")
var config = {
    name: 'Mock Server',
    root: process.cwd(),
    static: './',
    read: [],
    autoListen: true,
    CORS: true,
    connect: [],
    urlRewrite: [
        /*
        {
            regexp: '^\/static',
            replace: '/'
        }
        */
    ],
    staticReplace: function (req, data, filepath) {
        if(/\.(css|js|html)$/.test(filepath)) {
            return data.replace(/<!--MOSE([\S\s]*?)MOSE-->/g,'$1')
        }
    },
    ajax: {
        title: false,
        type: 'get',
        url: false,
        req: false,
        /*
        form data
        [
            {
                name: 'id',
                value: '1',
                // r => required
                r: true,
                // 默认为当前 type值
                in: 'get', // get post header
                desc: '用户id'
            }
        ]
        */
        match: false,
        datafn: function (data, type, done, req, res) {
            var output = data[type]
            switch (type) {
                case 'ok':
                    // output.time = new Date().getTime()
                break
                case 'err':
                break
                default:
            }
            // 不要使用 res.send(output),但可以使用 res.cookie 等方法
            // 使用 res.send() 会出现 warn 提示
            // 100 是 timeout
            done(output, 100)
        },
        data: {
            ok: {
                status: 'success'
            },
            err: {
                status: 'error'
            }
        },
        dataDefault: 'ok',
        statusCode: 200,
        /*
            statusCode: {
                ok: 200,
                err: 404,
                some: 404
            }
        */
        timeout: 250,
        /*
            timeout: {
                err: 2000
            }
        */
        dataType: 'html',
        doc: false,
        header: false,
        /*
        header: {
            ok: {
                'Authorization': 'XIJFOW',
                "TIME": new Date().getTime()
            },
            err: {
                'Authorization': 'false'
            }
        }
        */
    },
    renderReplace: function (req, html) {
        return html
    },
    render: {
        templatedDir: './',
        server: '/_mobe_render_server/',
        data: false
    },
    view: {
        type: 'get',
        req: false,
        res: {},
        resDefault: false,
        resStatus: 200,
        timeout: 0,
        dataType: 'html',
        doc: {},
        headers: false
    },
    resDatabase: 'file',
}
module.exports = function () {
    return extend(true, {}, config)
}
