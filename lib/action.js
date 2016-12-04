require('babel-polyfill')
require('babel-core/register')
require('colors')
const add = function (userSettings, app, funcType) {
    userSettings.__funcType = funcType
    userSettings.type = userSettings.type.toUpperCase()
    const actions = app.actions
    let trimAttr = ['type', 'url', 'title']
    trimAttr.forEach(function (attr) {
        if (userSettings[attr]) {
            userSettings[attr] = userSettings[attr].trim()
        }
    })
    if (userSettings.url.charAt(0) !== '/') {
        console.warn(`
${`app.${funcType}(settings)`.green}
Revise: settings.url = '/' + settings.url
        "${userSettings.url}" = "${'/'.cyan + userSettings.url}"
            `)
            userSettings.url = '/' + userSettings.url
    }
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
    app.actions[userSettings.url] = app.actions[userSettings.url] || []
    app.actions[userSettings.url].push(userSettings)
}

module.exports.add = add
