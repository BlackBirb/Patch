/* eslint-disable */
const Command = require("../Structures/Command.js")

module.exports = class Help extends Command {
    constructor(client, id) {
        super(client, id)
        this.name = "ping" // default command name
            // this.aliases = [ ] // alias
            // this.premissions = 0b1 // define them later
        this.channels = ["text"] //works only on guild

        this.types = {
            pong: {
                "name": {
                    required: true
                }
            },
            run: {
                "command": {
                    required: false,
                    err: ":|"
                }
            }
        }
        this.data = {
            "guildData": 0
        }
    }

    subhi(msg) {
        msg.reply("Ping Pong!")
    }
    async run(msg) {
        msg.reply(`Pong Ping!`)
    }

}