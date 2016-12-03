require('babel-polyfill')
require('babel-core/register')
require('colors')
const actions = {
    /*
    "/demo/": [
        {
            ... app.ajax
        }
        {
            ... app.view
        }
    ]
    */
}
const add = function (userSettings) {
    userSettings.type = userSettings.type.toUpperCase()
    for(let url in actions) {
        let urlActions = actions[url]
        urlActions.forEach(function (settings) {
            if (settings.type == userSettings.type && settings.title === userSettings.title) {
                throw new Error(`
${"## Please change title or type".green}
${"https://github.com/mosejs/mose/issues/59".cyan}
${`
    {
        type: "${settings.type}",
        url: "${settings.url}",
        title: "${settings.title}",
        match: ${JSON.stringify(settings.match)}
    }

    {
        type: "${userSettings.type}",
        url: "${userSettings.url}",
        title: "${userSettings.title}",
        match: ${JSON.stringify(userSettings.match)}
    }

`.red}
${`already existing,`.red} ${`Please change "title" or "type"`.green}
`
)
            }
        })
    }
    actions[userSettings.url] = actions[userSettings.url] || []
    actions[userSettings.url].push(userSettings)
}

module.exports.add = add
export {add}
