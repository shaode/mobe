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
            let settingsMatchString = JSON.stringify(settings.match)
            let userSettingsMatchString = JSON.stringify(userSettings.match)
            if (settings.type == userSettings.type && settingsMatchString === userSettingsMatchString && settings.url === userSettings.url) {
                throw new Error(`
${"[Error desc]Please change match || type || url".green}
${"https://github.com/mosejs/mose/issues/59".cyan}
${`
    {
        type: "${settings.type}",
        url: "${settings.url}",
        title: "${settings.title}",
        match: ${settingsMatchString}
    }

    {
        type: "${userSettings.type}",
        url: "${userSettings.url}",
        title: "${userSettings.title}",
        match: ${userSettingsMatchString}
    }
`.red}
${`already existing`.blue}`
)
            }
        })
    }
    actions[userSettings.url] = actions[userSettings.url] || []
    actions[userSettings.url].push(userSettings)
}

module.exports.add = add
export {add}
