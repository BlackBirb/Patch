module.exports = {
    author: "BlackBird#9999",
    failCommand: "415912144308273152",
    LOGGER_SPACING: 75,
    mongoUrl: "mongodb://localhost:27017/",
    asyncServices: ["Commands","MongoDB", "DiscordJS"], // API in future
    statusChangeDelay: 600000, // 5 min,
    inviteLink: "soon",
    webURL: "https://soon.lol/"
}

module.exports.PERMISSIONS = { // ???
    "BLACKLISTED": 0x0,
    "DEFAULT": 0x1,
    "EVAL": 1 << 29,
    "FULL_ADMIN": 1 << 30
},

module.exports.defaults = {
    guildSettings: {
        prefix: "!",
        tags: {
            dicc: "Yes i like",
            try: "Author: $author#\nNo mention: $authornick#\nchannel: $channel#\nparams: $params#\nparam2: $param2#"
        },
        defaultPermissions: 0x1,
        active: true,
        blacklistedChannels: []
    },
    userSettings: {
        permissions: {
            "GLOBAL": 0x1
        }
    }
}
