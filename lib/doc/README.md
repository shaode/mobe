# 项目维护者文档

# actions 设计

```
actions: {
    '/demo/': [
        extend(
            // view ajax
            {_mose_action_type: 'view'},

            // settings 指的是 app.ajax(settings) 中的 settings
            settings
            )
    ],
    '/demo/:id': [...]
}
```

每次 app.use('/demo/') 响应时做 `actions['/demo/'].forEach` 操作，根据 `settings.match` 匹配到对应 `settings`。最终根据 `settings` 的配置响应请求

urlRewrite 功能要做完善的测试。以前 fms 有个bug ,urlRewrite 与 RESTful 并不兼容。

# cookie + jsonDB + GUI 控制响应结果

```js
app.ajax({
    title: '获取新闻',
    url: '/news',
    type: 'get'
})

app.ajax({
    title: '提交新闻',
    url: '/news',
    type: 'post',
    req: [
        {
            name: 'title',
            value: '今日XX发射导弹',
            r: true,
            test: [
                {
                    type: 'email',
                    msg: '邮箱格式错误'
                }
            ],
            in: 'post',
            desc: '新闻标题'
        },
        {
            name: 'content',
            value: 'XX在20日上午7点左右从西北部附近发射了一枚可能是新型中程弹道导弹“XX”的飞行物',
            r: true,
            in: 'post',
            desc: '新闻内容'
        }
    ]
})
```

```js
// 当在 `/mose` 修改 nimo 方案的 GETloigin 为 "err" 时，响应方案在数据库中应该是这样的
{
    "nimo": {
        '获取新闻': "err"
    }
}
```

使用者通过 `/mose` 页面输入响应方案，并修改AJAX与View的响应结果。每次修改会将响应方案对应的每个请求的响应结果提交给服务器。

服务器记录响应方案和响应结果。通过访问者 cookie 判断使用哪种响应结果。 访问者要通过 `/mose` 输入响应方案。

> 因为一个 url 有多种形式的多种响应结果。所以 `ajax(settings)` `view(settings)` 中的 `settings` 必须配置唯一不重复的 title


## req 需要一个校验库

考虑与 `react-fast-form` 使用同一个校验库
