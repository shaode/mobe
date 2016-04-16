'use strict'
var extend = require("extend")
var config = {
    // 项目名
    name: 'F.M.S',
    // 端口 http://127.0.0.1:3000/
    port: 3000,
    // 项目根目录配置
    root: process.cwd(),
    // 静态资源路径
    static: './',
    // 跨域开关
    CORS: true,
    // 读取HTML文件在 / 或 /fms/ 中 显示
    read: [],
    // express 中的 connect，如不熟悉请无视
    connect: function (req, res ,next) {
        next();
    },
    // URL替换
    urlRewrite: [

    ],
    // fms.ajax(settings) 默认配置
    ajax: {
        type: 'get',
        /*
        // 请求参数
        data: {
            id: 1
        }
        */
        res: {
            ok: {
                status: 'success'
            },
            err: {
                status: 'error',
                msg: 'Error detail'
            }
        },
        resStatus: {
            ok: 200,
            err: 200
        },
        timeout: 0,
        dataType: 'html',
        mockjsTemplate: true,
        doc: {},
        docTemplate: function () {/*!            
<%
var title = title?title:url
var request = request?request:false
%> 
`AJAX` <%= title %>
---
- url: [<%=url%>](<%=url%>)
- type: `<%=type%>`

<% if (typeof request === 'object') {%>

#### Request:
<% if (Array.isArray(request)) { %>
<table>
    <thead>
        <tr>
            <th>Name</th><th>Required</th><th>Default</th><th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <% request.forEach(function (item) { %>
            <tr>
            <% item.forEach(function (value, index) { %>
                <td>
                <% if (index !== 3) { %><code><% } %>
                    <% if (index === 1) { %>
                        <% if(value === true) { %>
                            <span style="color:#e44b23;" >Yes</span>
                        <% } else {%>
                            <span style="color:gray;" >No</span>
                        <% } %>
                    <% } else { %>
                    <%- value %>
                    <% } %>
                <% if (index !== 3) { %></code><% } %>
                </td>
            <% }) %>

            <% var emptyItem = 4 - item.length; %>
            <% for (;emptyItem--;){ %>
                <td></td>
            <% } %>

            </tr>
        <% }) %>
    </tbody>
</table>
<% } else { %>
```js
<%- FMSutil.formatJson(JSON.stringify(request)) %>
```
<% } %>
<% } %>


#### Response:
<%for (var key in res) {%>
**<%= key %>**
```js
<%- res[key] %>
```
<%}%>
        */}
    },
    view: {
        templateDir: './view/',
        templatePluginDir: './view/plugin/',
        type: 'get',
        data: {
            DEV: true
        },
        server: '/_fms_render_server/',
        filter: function (req, data) {
            /*
            不允许重写 data ：
            data = {}
            */
            // data.PAGE_URL = req.url;
            // data.PAGE_PATH = req.path;
            // data.METHOD = req.method;
            // data.GET = req.query;
            // data.POST = req.body;
        },
        docTemplate: function() {/*!
`View` {{#if typeof title !== 'undefined'}}{{title}}{{else}}{{url}}{{/if}}
---------
- url: [{{url}}]({{url}})
- template: `{{template}}`
- type: `{{type}}`

{{#if request}}
#### Request:
```js
{{{request}}}
```
{{/if}}
#### Data:
{{#if data}}
```js
{{{data}}}
```
{{/if}}
        */}
    }
}

module.exports = function () {
    return extend(true, {}, config)
}
