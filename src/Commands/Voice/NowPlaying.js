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

    async run(msg, p, { voice }) {
        if(msg.channel.permissions.has("MANAGE_MESSAGES"))
            msg.delete()
        if(!voice.queue.active) 
            return msg.channel.send("I'm not playing anything")

        voice.msg.setChannel(msg.channel)
        return voice.msg.nowPlaying()
    }
}
