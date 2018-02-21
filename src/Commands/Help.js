const Command = require("../Structures/Command.js")

module.exports = class Help extends Command {
    constructor(client, id) {
        super(client, id)
        this.name = "help",
        this.aliases = ["halp"],
        this.premissions = 0b1 // define them later
        this.channels = ["text", "dm"]
    }

    subhi(msg) {
        msg.reply("Hello!")
    }

    async run(msg) {
        msg.reply("Yep. I don't know what to do anymore, gib me sec")
    }
}