const { PlayerManager } = require("discord.js-lavalink");
const getStatus = require("../Utils/playingStatus.js")

module.exports = function(evn) {
    console.loading("Initializing commands")
    this.registry.initCommands()
    console.ok("Commands initialized")

    if(typeof evn === "string") {
        return console.loaded("Fake test loaded!")
    }

    this.VoicePlayer = new PlayerManager(this, this.config.lavalink.nodes, {
        user: this.user.id,
        shards: 1
    });
    
    console.loading("Getting guilds settings...")
    this.guilds.forEach(g => g.prepareGuild())
    console.ok("Guilds settings loaded")
    
    if(!this.config.hasOwnProperty("run")) { // Disable for testing only
        console.log("But why")
        this.user.setActivity(...getStatus(this))
        setInterval(() => this.user.setActivity(...getStatus(this)), this.constants.statusChangeDelay)
    }
    console.log("All systems ready?")
}