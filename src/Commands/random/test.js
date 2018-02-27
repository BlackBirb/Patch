const Command = require("../../Structures/Command.js")

module.exports = class Help extends Command {
    constructor(client, id) {
        super(client, id)
        this.name = "test",
        this.aliases = ["testing"],
        this.premissions = 0b1 // define them later
        this.channels = ["text", "dm"]

        this.data = {
            "guildData": 0
        }
    }

    async run(msg) {
        console.log(this.data)
        msg.reply(`Yep. Command ${this.name} works\n${this.data.guildData}`);

        this.data.guildData += 1
        
    }
}