const Command = require("../Structures/Command.js")

module.exports = class Help extends Command {
    constructor(client, id) {
        super(client, id)
        this.name = "help"
        this.aliases = ["halp"]
        this.permissions = 0x10 // define them later
        this.ignoreBlacklist = true
        this.channels = ["text", "dm"]

        this.types = {
            run: {
                "command": {
                    required: false,
                    type: "string",
                    err: "What command do you need help with?"
                }
            }
        }
    }

    async run(msg, params) {
        if(!msg.guild.active() || msg.channel.blacklisted) 
            return msg.reply("I was told not to answer on this channel, so... bye.")
        msg.reply(`Yep. I don't know what to do anymore.\nParams:\n ${params.string}\nAnd debug:\nActive: ${msg.guild.active()}\nBlackListed: ${msg.channel.blacklisted}`)
    }
}