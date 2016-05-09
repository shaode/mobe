'use strict'
var extend = require("extend")
var config = {
    // 项目名
    name: 'Mock Server',
    // 端口 http://127.0.0.1:2000/
    port: 2000,
    // 项目根目录配置
    root: process.cwd(),
    // 静态资源路径
    static: './',
    // 自动监听端口
    autoListen: true,
    // 跨域开关
    CORS: true,
    // 读取HTML文件在 / 或 /mobe/ 中 显示
    read: ['/'],
    // express 中的 connect，如不熟悉请无视
    connect: [function (req, res ,next) {
        next();
    }],
    // URL替换
    urlRewrite: [

    ],
    // 静态资源替换
    staticReplace: function (req, data, filepath) {
        if(/\.(css|js|html)$/.test(filepath)) {
            return data.replace(/<!--MOBE([\S\s]*?)MOBE-->/g,'$1')
        }
    },
    ajax: {
        type: 'get',
        res: {},
        resDefault: false,
        resStatus: 200,
        timeout: 0,
        dataType: 'html',
        doc: {},
        headers: function () {
            return {}
        }
    },
    render: {
        templatedDir: './view/',
        server: '/_mobe_render_server/',
        data: function (req) {
            return {
                DEV: true,
                _JUST_A_DEMO_GET: req.query
            }
        }
    },
    view: {
        type: 'get',
        res: {},
        resDefault: false,
        resStatus: 200,
        timeout: 0,
        dataType: 'html',
        doc: {},
        headers: function () {
            return {}
        }
    },
    // 通过 cookie 或 file 记录 res 的可视化修改 (本地开发建议使用 file)
    resDatabase: 'file',
}

module.exports = function () {
    // deep clone
    return extend(true, {}, config)
}
