let http = require('http')
let portfinder = require('./vendor/portfinder')
portfinder.basePort = require('./config')().port
let startLog = function (config) {
    console.log('[' + config.name +'] Running at ' + ('http://127.0.0.1:' + config.port).cyan);
    console.log('Static: ' + config.static.cyan)
}
module.exports = function (port) {
    let self = this
    let config = self.config
    if (port) {
        self.config.port = port
    }
    let server = http.createServer(self.app).listen(config.port)
    let successLogTimer = setTimeout(function () {
        startLog(self.config)
    })
    server.on('error', function(err) {
        clearTimeout(successLogTimer)
        if (err.code === 'EADDRINUSE') {
            portfinder.getPort(function (err, port) {
                if (err) {
                    console.log(('get random port error, Please contact me: https://github.com/mobejs/mobe/issues/new').red)
                    throw err
                }
                console.log(('Port: ' + config.port + ' is existing, Random port is '+ port).yellow)
                config.port = port
                startLog(self.config)
                self.httpServer = http.createServer(self.app).listen(config.port)
             });
        } else {
            throw err
        }
    })
    self.httpServer = server
}
