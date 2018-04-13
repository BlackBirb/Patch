const { RichEmbed } = require("discord.js")
const Command = require("../../Structures/Command.js")
const codes = require("../../Client/Utils/Constants.js").VOICE.codes

module.exports = class Play extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "play"
        this.help = {
            desc: "Plays a song on voice channel. Automaticly joins you if not already in channel.",
            format: "[Youtube URL] / [Song Title]"
        }
        this.channels = ["text"]
        this.requiredPermissions = ["ADD_REACTIONS"]

        this.types = {
            song: {
                required: true,
                err: "And... What song you want me to play exactly?"
            }
        }

        this.numberReactions = ["❌","1⃣","2⃣","3⃣","4⃣","5⃣"]
    }

    async addReactions(message, amount) {
        try {
            for(let i=1; i<=amount;i++) {
                await message.react(this.numberReactions[i])
            }
            await message.react(this.numberReactions[0])
        }
        catch(err) {
            console.log("Nope, still breaks")
        }
        return
    }

    async pickSong(msg, query, voiceManager) {
        const search = await voiceManager.find(query)

        const embed = new RichEmbed()
            .setTitle("This is what i found on YouTube:")
            .setDescription("Pick song using reaction! You have 60s!")
            .setFooter("Powered by Patch", this.client.user.avatarURL)

        for(let i=0; i<search.length;i++) {
            const song = search[i]
            embed.addField(`#${i+1}`, `#${i+1} Song **[${song.title}](https://youtu.be/${song.id})** by *[${song.channel.name}](https://www.youtube.com/channel/${song.channel.id})*`, false)
        }

        const select = await msg.channel.send(embed)
        
        const reactionsPromise = this.addReactions(select, search.length)

        const collected = await select.awaitReactions((reaction, user) => this.numberReactions.includes(reaction.emoji.name) && user.id === msg.author.id, { time: 60000, max: 1 } )

        reactionsPromise.then(() => select.delete())

        if(collected.size < 1)
            return 0
        
        const emoji = collected.first().emoji.toString()
        const index = this.numberReactions.indexOf(emoji)
        let id = null
        if(index > 0) id = search[index-1].id
        return { index, id }
    }
    
    async run(msg, params, { voice, voiceManager, deleteMessage }) {
        if(msg.channel.permissions.has("MANAGE_MESSAGES"))
            msg.delete()
        if(!voice.connection) {
            if(msg.member.voiceChannel) {
                try {
                    await voice.join(msg.member.voiceChannel)
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
                msg.reply(`Joined channel **${msg.member.voiceChannel.name}**!`).then(deleteMessage)
            }
            else 
                return msg.channel.send("I'm not in voice channel, and I don't know which one should I join... AAAAAAA")
        }

        let id = null
        const suffix = params.toString()
        if(suffix.includes("youtube.com/watch?v=")) 
            id = /(?:https:\/\/www.)?youtube.com\/watch\?v=(.+)/gi.exec(suffix)[1]
        else if(suffix.includes("youtu.be/"))
            id = /(?:https:\/\/)youtu.be\/(.+)/gi.exec(suffix)[1]
        else {
            const pick = await this.pickSong(msg, suffix, voiceManager)
            if(pick.index === 0) return msg.reply("Ok, nevermind").then(deleteMessage)
            id = pick.id
        }

        if(!id) return msg.reply("I can't find that song..").then(deleteMessage)

        try {
            const song = await voiceManager.songInfo(id, msg.author)
            voice.msg.setChannel(msg.channel)
            voice.addSong(song)
        }
        catch(err) {
            console.error("At voice\n",err)
            return msg.reply("I can't find that song..").then(deleteMessage)
        }
        
    }
}
