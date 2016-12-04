require('babel-polyfill')
require('babel-core/register')
const action = require('./action')
const ajax = function (userSettings) {
    let self = this
    action.add(userSettings, self)
}
module.exports = ajax
export default ajax
