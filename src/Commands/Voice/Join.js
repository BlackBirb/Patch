const Command = require("../../Structures/Command.js")
const codes = require("../../Client/Utils/Constants.js").VOICE.codes

module.exports = class Play extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "join"
        this.help = {
            desc: "Tells me what voice channel to join, I can also join channel you're in.\n(Also you can just use play command and I'll join you then)",
            format: "<channel name>"
        }
        this.aliases = ["connect"]
        this.channels = ["text"]

        this.types = {
            name: {}
        }

        this.joinMessages = [
            "Patch, ready to play!",
            "Processing...",
            "Ready to play!",
            "Meow?",
            "Waiting for music!",
            "Hi.",
            "Magic!"
        ]
    }

    async run(msg, params, { voice, utils }) {
        if(msg.channel.permissions.has("MANAGE_MESSAGES"))
            msg.delete()
        let voiceChannel = msg.member.voiceChannel
        if(!voiceChannel) {
            if(!params.name) 
                return msg.channel.send("First join a voice channel or at least tell me its name...")
            let name = params.name.toLowerCase()
            voiceChannel = msg.guild.channels.find(c => c.name.toLowerCase().includes(name))
            if(!voiceChannel)
                return msg.channel.send("I can't find that channel, sorry.")
        }

        try {
            await voice.join(voiceChannel)
        }
        catch(err) {
            if(err.code){
                if(err.code === codes.noPermissions) 
                    return msg.channel.send("I don't have permissions to join or speak on that channel :c")
                if(err.code === codes.fullChannel)
                    return msg.channel.send("There's no room for me in that channel...")
            }
            return msg.channel.send("Ouch, very bad error: "+err)
        }
        voice.msg.setChannel(msg.channel)
        msg.reply(`Voice channel **${voiceChannel.name}** joined! *${utils.pickRandom(this.joinMessages)}*`)
    }
}
