module.exports = {
    author: "BlackBird#9999",
    failCommand: "415912144308273152",
    permissions: {
        "FULL_ADMIN": 0b1 //??
    },
    LOGGER_SPACING: 75,
    mongoUrl: "mongodb://localhost:27017/",
    asyncServices: ["Commands","MongoDB", "DiscordJS"], // API in future
    statusChangeDelay: 300000 // 5 min
}

module.exports.defaults = {
    guildSettings: {
        prefix: "!",
        tags: [{name: "dicc", value: "Yes i like"}]
    }
}