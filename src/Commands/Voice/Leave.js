const Command = require("../../Structures/Command.js")

const deleteMessage = m => m.delete(30000)

module.exports = class Play extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "leave"
        this.help = {
            desc: "Makes me leave voice channel. But I won't leave if song is playing, skip it if you have to."
        }
        this.aliases = ["disconnect"]
        this.channels = ["text"]
    }

    async run(msg) {
        if(!this.voice.connection) 
            return msg.channel.send("I'm not in voice channel!")

        if(this.voice.playing) 
            return msg.channel.send(`I can't leave while I'm playing a song.`).then(deleteMessage)

        this.voice.msg.channelLeave()
        this.voice.leave()
    }
}
