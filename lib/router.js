require('babel-polyfill')
require('babel-core/register')
const router = function (req, res, next) {
    next()
}
module.exports = router
export default router
