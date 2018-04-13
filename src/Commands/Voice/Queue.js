const Command = require("../../Structures/Command.js")

module.exports = class NowPlaying extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "queue"
        this.help = {
            desc: "Sends the song queue!",
            format: " / next"
        }
        this.aliases = ["songs", "next"]
        this.channels = ["text"]
    }

    subnext(msg, p, { voice, deleteMessage }) {
        if(msg.channel.permissions.has("MANAGE_MESSAGES"))
            msg.delete()
        if(!voice.queue.active) 
            return msg.channel.send("I'm not playing anything").then(deleteMessage)
        
        voice.msg.setChannel(msg.channel)
        return voice.msg.nextInQueue()
    }

    async run(msg, p, { voice, deleteMessage }) {
        if(msg.command === "next") return this.subnext(msg, p, { voice, deleteMessage })
        if(msg.channel.permissions.has("MANAGE_MESSAGES"))
            msg.delete()
        if(!voice.queue.active) 
            return msg.reply("I'm not playing anything").then(deleteMessage)
        
        voice.msg.setChannel(msg.channel)
        return voice.msg.queue(msg.author)
    }
}
