const { RichEmbed } = require("discord.js")
const constants = require("../Utils/Constants.js")
const { formatSec, pickRandom } = require("../Utils/Main.js")

const createTimeline = (pos, max) => {
    const amount = Math.ceil(pos/max*25)
    if(amount < 25) 
        return `[${"■".repeat(amount)}${"-".repeat(25-amount)}]`
    return `[${"■".repeat(25)}]`
}

const leaveMessages = [
    "Bye!",
    "See you tommorow!",
    "Awww, too bad.",
    "Invite me again!"
]

module.exports = class VoiceMessenger {
    constructor(manager) {
        this.voice = manager
        this.channel = null
        this.message = null
    }

    async send(...opts) {
        if(!this.channel) return;
        if(this.message) {
            this.message.delete()
            this.message = null
        }
        this.message = await this.channel.send(...opts)
        return this.message
    }

    enqueued(song) {
        if(!this.channel) return;
        const embed = new RichEmbed()
            .setColor(constants.STYLE.embed.color)
            .setAuthor("Enqueued", this.channel.client.user.avatarURL)
            .setDescription(`**${song.title}** \n*Length: ${formatSec(song.length)}*\n*Queue size: ${this.voice.queue.size} | Queue length: ${this.voice.queue.length}*`)
            .setFooter(`Requested by ${song.requester.tag}`)
            .setThumbnail(song.thumbnail)
        return this.send(embed)
    }

    nextSong(song) {
        if(!this.channel) return;
        const length = song.length
        const embed = new RichEmbed()
            .setColor(constants.STYLE.embed.color)
            .setAuthor("Now playing", this.channel.client.user.avatarURL)
            .setDescription(`**${song.title}** \n*Length: ${formatSec(length)}*`)
            .setFooter(`Requested by ${song.requester.tag}`)
            .setThumbnail(song.thumbnail)
        return this.send(embed)
    }

    nowPlaying() {
        if(!this.channel) return;
        const song = this.voice.queue.active
        const embed = new RichEmbed()
            .setColor(constants.STYLE.embed.color)
            .setAuthor("Now playing", this.channel.client.user.avatarURL)
        if(!song) {
            return this.send(embed
                .setDescription(`Nothing!`)
                .setFooter(`Powered by Patch`))
        }
        const playing = Math.ceil(this.voice.dispatcher.time/1000) || 0
        const length = song.length
        embed
            .setDescription(`**${song.title}**\n${formatSec(playing)} ${createTimeline(playing, length)} ${formatSec(length)}`)
            .setFooter(`Requested by ${song.requester.tag}`)
            .setThumbnail(song.thumbnail)
        return this.send(embed)
    }

    queueEnd() {
        return this.send(`Queue ended! Give me more music!`)
    }

    channelLeave() {
        return this.send(`Left **${this.voice.voiceChannel.name}** channel! *${pickRandom(leaveMessages)}*`)   
    }

    err(text) {
        return this.send(text)
    }

    setChannel(channel) {
        if(!channel) {
            this.channel = null
            this.message = null
            return null
        }
        if(this.channel && this.channel.id === channel.id) return false
        this.channel = channel
        return this
    }
}
