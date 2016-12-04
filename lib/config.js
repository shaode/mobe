require('babel-polyfill')
require('babel-core/register')
import extend from "extend"
const config = {
    name: 'Mock Server',
    root: process.cwd(),
    static: './',
    read: [],
    listen: true,
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
        return data
    },
    ajax: {
        title: false,
        // type: 'get',
        // url: false,
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
        match: {},
        // onlyreal: true,
        // real: false,
        /*
        function (req, res) {
            var rtype = /err/.test(req.body.title)?'err': 'ok'
            var data = this.data[rtype]
            switch(rtype) {
                case 'ok':
                    data.time = new Date().getTime()
                break
            }
            res.header(this.header[rtype])
            res.status(this.statusCode[rtype])
            res.send(data)
        },
        */
        data: {
            ok: {
                status: 'success'
            },
            err: {
                status: 'error',
                msg: 'Error default'
            }
        },
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
    render: {
        templatedDir: './',
        server: '/_mobe_render_server/',
        data: false,
        replace: function (req, html) {
            return html
        }
    },
    view: {
        type: 'get',
        match: false,
        req: false,
        real: false,
        /*
        function (req, res) {
            var rtype = /err/.test(req.body.title)?'err': 'ok'
            var data = this.data[rtype]
            switch(rtype) {
                case 'ok':
                    data.time = new Date().getTime()
                break
            }
            res.header(this.header[rtype])
            res.status(this.statusCode[rtype])
            res.mockview(data, './view/index.html')
        },
        */
        data: {},
        statusCode: 200,
        timeout: 0,
        dataType: 'html',
        header: false,
                doc: {},
    },
    resDatabase: 'file',
}
function returnConfig () {
    return extend(true, {}, config)
}
export default returnConfig
module.exports = returnConfig
