var Handlebars = require('handlebars')
var fs = require('fs')
var mime = require('mime')
var readdir = require('readdir')
module.exports = function (self) {
    var config = self._config
    var handlers = self._handlers
    // static server
    handlers['_static'] = function (req, res, next, pathname) {

        var filepath = config.static + pathname
        var handleError = function (err) {
            if (err.code === 'ENOENT')  {
                next()
            }
            else {
                res.status(404).send(err)
            }
        }
        var path = require('path')
        fs.stat(filepath, function (err, stat) {
            if (err) {handleError(err);return}
            // 输出目录列表
            if (stat.isDirectory()) {
                readdir.read(filepath, readdir.INCLUDE_DIRECTORIES + readdir.NON_RECURSIVE, function (err, filesArray) {
                    if (err) {handleError(err);return}
                    if (!self._render.staticList) {
                        fs.readFile(__dirname + '/handlebars/static.hbs', 'utf-8', function (err, source) {
                            if (err) {handleError(err);return}
                            self._render.staticList = Handlebars.compile(source)
                            viewDir()
                        })
                    }
                    else {
                        viewDir()
                    }
                    function viewDir () {
                        var path = pathname
                        if (!/\/$/.test(path)) {
                            path = path + '/'
                        }
                        var html = self._render.staticList({
                            title: pathname,
                            path: path,
                            list: filesArray
                        })
                        res.send(html)
                    }
                })
            }
            // 输出文件
            else {
                fs.readFile(filepath, function (err, data) {
                    if (err) {handleError(err);return}
                    var contentType = mime.lookup(filepath)
                    res.set({
                        'Content-Type': contentType
                    })
                    res.send(data)
                })
            }
        })
    }

    // consoleHandle
    var regexp = {
        titleTag: /<\s*title\s*>([^<]*)<\/\s*title\s*>/
    }
    var consoleHandle = function (req, res, next) {
        var type = req.query.type
        if (typeof req.query['m.js'] !== 'undefined') {
            res.sendFile(__dirname + '/static/js/fms.js')
            return
        }
        switch (type) {
            // case 'handle':
            // res.json(controller.getHandList())
            // break
            case 'read':
            // config.read = ["/", "html"]
            var list = []
            eachAsync(config.read, function (dirname, index, nextEachDir) {
                var filter
                if (dirname === '/') {
                    filter = ['*.html', '*.htm']
                }
                else {
                    if (dirname.charAt(0) !== '/') {
                        dirname = '/' + dirname
                    }
                    if (!/\/$/.test(dirname)){
                        dirname = dirname + '/'
                    }
                    filter = ['**.html', '**.htm']
                }
                readdir.read( config.static + dirname, filter, readdir.INCLUDE_DIRECTORIES, function (err, filesArray) {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            list.push({
                                title: dirname,
                                files: []
                            })
                            nextEachDir()
                            return
                        }
                        console.log(err)
                    }                
                    // filesArray = ['index.html', 'demo.html']
                    eachAsync(filesArray, function (filename, index ,next) {
                        var filepath = config.static + dirname  + filename
                        fs.readFile(filepath, 'utf-8', function (err, data) {
                            if (err) console.log(err)                            
                            var aPageTitle = data.match(regexp.titleTag)
                            var sTitle = 'not title'
                            if (aPageTitle) {
                                sTitle = aPageTitle[1]
                            }
                            // index.html = ['首页', 'index.html']
                            filesArray[index] = {
                                title: sTitle,
                                url: dirname + filename,
                                filename: filename.replace(/.*\/(.*)$/, '$1')
                            }
                            next()
                        })
                    }, function () {
                        list.push({
                            title: dirname,
                            files: filesArray
                        })
                        // 遍历下一个目录
                        nextEachDir()
                    })

                })

            }, function (err) {
            // 完成静态 HTML 的遍历
                if (err) console.log(err)
                res.json(list)        
            })
            break
            // case 'doc':
            // if (!self._data.doc) {
            //     self._data.doc = doc.getDoc()
            // }
            // res.send(self._data.doc)
            // break
            case 'qrcode':
                var text = req.query.text
                res.send(qrcode.toDataURL(text, 4))
            break
            case 'fms.css':
                res.sendFile(__dirname + '/static/css/fms.css')
            break
            case 'fms.js':
                res.sendFile(__dirname + '/static/js/fms.js')
            break
            case 'cookie':
                res.sendFile(__dirname + '/static/json.html')
            break
            default:
                res.sendFile(__dirname + '/static/console.html')
        }
    }
    handlers['_index'] = consoleHandle
    handlers['/fms/'] = consoleHandle
}