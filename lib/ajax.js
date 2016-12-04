require('babel-polyfill')
require('babel-core/register')
const extend = require('extend')
const action = require('./action')
const ajax = function (userSettings) {
    let self = this
    self.config.ajax
    userSettings = extend(true, {}, userSettings)
    userSettings = extend(true, self.config.ajax, userSettings)
    action.add(userSettings, self, 'ajax')
}
module.exports = ajax
export default ajax
