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
