const Command = require("../../Structures/Command.js")

module.exports = class NowPlaying extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "playing"
        this.help = {
            desc: "Says what I'm playing!"
        }
        this.aliases = ["now","nowplaying"]
        this.channels = ["text"]
    }

    inhibitor(msg, p, { voice, deleteMessage }) {
        if(msg.channel.permissions.has("MANAGE_MESSAGES"))
            msg.delete()
        
        if(!voice.queue.active) {
            msg.reply("I'm not playing anything").then(deleteMessage)
            return false
        }
    }

    async run(msg, p, { voice }) {

        voice.msg.setChannel(msg.channel)
        return voice.msg.nowPlaying()
    }
}
