const Command = require("../../Structures/Command.js")

module.exports = class Queue extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "queue"
        this.help = {
            desc: "Sends the song queue! If you use alias `!next` or give it parameter `next` it shows only next song",
            format: " / next"
        }
        this.aliases = ["songs", "next"]
        this.channels = ["text"]
    }

    inhibitor(msg, p, { voice, deleteMessage }) {
        if(msg.channel.permissions.has("MANAGE_MESSAGES"))
            msg.delete()
        
        if(!voice.queue.active) {
            msg.reply("I'm not playing anything").then(deleteMessage)
            return false
        }
        
        voice.msg.setChannel(msg.channel)
    }

    subnext(msg, p, { voice }) {
        return voice.msg.nextInQueue()
    }

    async run(msg, p, { voice }) {
        if(msg.command === "next") return this.subnext(msg, p, { voice })
        return voice.msg.queue()
    }
}
