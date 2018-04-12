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
        this.requiredPermissions = "MANAGE_MESSAGES"
    }

    async run(msg) {
        msg.delete()
        if(!this.voice.queue.active) 
            return msg.channel.send("I'm not playing anything")

        this.voice.msg.setChannel(msg.channel)
        return this.voice.msg.nowPlaying()
    }
}
