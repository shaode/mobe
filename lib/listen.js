import http from "http"
const listen = function (port) {
    let self = this
    let config = self.config
    if (port) {
        self.config.port = port
    }
    let server = http.createServer(self.app).listen(config.port)

    let successLogTimer = setTimeout(function () {
        console.log('[' + config.name +'] Running at ' + ('http://127.0.0.1:' + config.port).cyan);
        console.log('Static: ' + config.static.cyan)
        console.log('Render templatedDir: ' + config.render.templatedDir.cyan)
    })
    server.on('error', function(err) {
        clearTimeout(successLogTimer)
        if (err.code === 'EADDRINUSE') {
            let msg = '(Mose + ' + config.name + ') port: ' + config.port + ' is existing'
            console.log(msg.red)
            throw new Error(msg)
        } else {
            throw err
        }
    })
    self.httpServer = server
}
export default listen
module.exports = listen
