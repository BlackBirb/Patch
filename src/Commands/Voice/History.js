const Command = require("../../Structures/Command.js")

module.exports = class History extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "history"
        this.help = {
            desc: "You liked last song but forgot to check its name? Don't worry I remember last 5 songs ^^",
            format: " / last"
        } 
        this.aliases = ["last"]
        this.channels = ["text"]
    }

    inhibitor(msg, p, { voice, deleteMessage }) {
        if(msg.channel.permissions.has("MANAGE_MESSAGES"))
            msg.delete()
        
        if(voice.history.length < 1) {
            msg.reply("Hisotry is empty!").then(deleteMessage)
            return false
        }
        voice.msg.setChannel(msg.channel)
    }

    sublast(msg, p, { voice }) {
        return voice.msg.lastPlayed()
    }

    run(msg, p, { voice }) {
        if(msg.command === "last") return this.sublast(msg, p, { voice })
        return voice.msg.history()
    }
}
