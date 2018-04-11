const Command = require("../../Structures/Command.js")

module.exports = class Play extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "leave"
        this.help = {
            desc: "Makes me leave voice channel. But I won't leave if song is playing, skip it if you have to."
        }
        this.aliases = ["disconnect"]
        this.channels = ["text"]

        this.leaveMessages = [
            "Bye!",
            "See you tommorow!",
            "Awww, too bad."
        ]
    }

    async run(msg) {
        if(!this.voice.connection) 
            return msg.channel.send("I'm not in voice channel!")
        
        const channel = this.voice.voiceChannel

        if(!this.voice.leave()) 
            return msg.channel.send(`I can't leave while I'm playing a song.`)

        return msg.channel.send(`Leaving **${channel.name}** channel! *${this.utils.pickRandom(this.leaveMessages)}*`)       
    }
}
