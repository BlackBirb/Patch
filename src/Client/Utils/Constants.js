module.exports = {
    author: "BlackBird#9999",
    failCommand: "415912144308273152",
    LOGGER_SPACING: 75,
    mongoUrl: "mongodb://localhost:27017/",
    asyncServices: ["Commands","MongoDB", "DiscordJS", "Web"],
    statusChangeDelay: 600000, // 5 min,
    inviteLink: "https://discordapp.com/oauth2/authorize?client_id=207051061213528064&scope=bot&permissions=104188992",
    webURL: "https://soon.lol/"
}

module.exports.STYLE = {
    embed: {
        color: 3447003,
        colorFail: 0xCC181E
    }
}

module.exports.PERMISSIONS = { // ???
    "BLACKLISTED": 0x0,
    "DEFAULT": 1 << 0,

    // voice
    "FORCE": 1 << 10, 

    // admin
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
        blacklistedChannels: [],
        responses: true,
        voice: {
            volume: .5
        },
        cooldowns: { // in seconds
            response: 10
        }
    },
    userSettings: {
        permissions: 0x1,
        guildPermissions: {}
    },
    userAccount: {
        currency: 0,
        customHug: {
            give: null,
            back: null,
            "get?": null
        },
        tags: {}
    }
}

module.exports.VOICE = {
    codes: {
        noPermissions: 0,
        differentGuild: 1,
        fullChannel: 2
    },
    ytdlOptions: { filter : 'audioonly' },
    pickTime: 30000,
    autoLeave: 60000 // should be bigger than pick time.
}
