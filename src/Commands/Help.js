const Command = require("../Structures/Command.js")

module.exports = class Help extends Command {
    constructor(client, id) {
        super(client, id)
        this.name = "help",
        this.aliases = ["halp"],
        this.premissions = 0b1 // define them later
        this.channels = ["text", "dm"]

        this.types = {
            hi: {
                "name": {
                    required: true
                }
            },
            run: {
                "command": {
                    required: false,
                    err: "What command do you need help with?"
                },
                "k": {} // hmm... need better way to do this
            }
        }
    }

    subhi(msg) {
        msg.reply("Hello!")
    }

    async run(msg, params) {
        msg.reply(`Yep. I don't know what to do anymore.\nParams:\n ${params.string}`)
    }
}