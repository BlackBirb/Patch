const Command = require("../../Structures/Command.js")

module.exports = class Help extends Command {
    constructor(client, id) {
        super(client, id)
        this.name = "test",
        this.aliases = ["testing"],
        this.premissions = 0b1 // define them later
        this.channels = ["text", "dm"]
    }

    async run(msg) {
        msg.reply(`Yep. I work`);
    }
}