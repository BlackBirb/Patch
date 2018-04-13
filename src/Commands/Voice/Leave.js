const Command = require("../../Structures/Command.js")

const deleteMessage = m => m.delete(60000)

module.exports = class Play extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "leave"
        this.help = {
            desc: "Makes me leave voice channel. But I won't leave if song is playing, skip it if you have to."
        }
        this.aliases = ["disconnect"]
        this.channels = ["text"]
        this.requiredPermissions = "MANAGE_MESSAGES"

        this.types = {
            "force": {}
        }

    }

    async run(msg, params, { voice }) {
        msg.delete()
        if(!voice.connection) 
            return msg.channel.send("I'm not in voice channel!")

        if(params.force && !(msg.author.id === msg.guild.ownerID || await msg.author.hasPermission(this.client.constants.PERMISSIONS.FORCE, msg.guild))) 
            return msg.channel.send(`Sorry, you cannot do that.`).then(deleteMessage)
        else if(!params.force && voice.playing)
            return msg.channel.send(`I can't leave while I'm playing a song.`).then(deleteMessage)

        voice.leave()
    }
}
