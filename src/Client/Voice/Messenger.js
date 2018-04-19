const { RichEmbed } = require("discord.js")
const constants = require("../Utils/Constants.js")
const { formatSec, pickRandom } = require("../Utils/Main.js")

const createTimeline = (pos, max) => {
    const amount = Math.ceil(pos/max*25)
    if(amount < 25) 
        return `[${"■".repeat(amount)}${"-".repeat(25-amount)}]`
    return `${"■".repeat(25)}`
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
        this.timeout = null
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

    reset() {
        if(this.timeout) 
            clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.nowPlaying()
            this.timeout = null
        }, 30000)
    }

    enqueued(song) {
        const embed = new RichEmbed()
            .setColor(constants.STYLE.embed.color)
            .setAuthor("Enqueued", song.requester.icon)
            .setDescription(`**[${song.title}](${song.url})** \n*Length: ${formatSec(song.length)}*\n*Queue size: ${this.voice.queue.size} | Queue length: ${formatSec(this.voice.queue.length)}*`)
            .setFooter(`Requested by ${song.requester.tag}`)
            .setThumbnail(song.thumbnail)
        this.reset()
        return this.send(embed)
    }

    nextSong(song) {
        const embed = new RichEmbed()
            .setColor(constants.STYLE.embed.color)
            .setAuthor("Now playing", song.requester.icon)
            .setDescription(`**[${song.title}](${song.url})** \n*Length: ${formatSec(song.length)}*`)
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
            .setAuthor("Now playing", song.requester.icon)
            .setDescription(`**[${song.title}](${song.url})**\n${formatSec(playing)} \`${createTimeline(playing, length)}\` ${formatSec(length)}`)
            .setFooter(`Requested by ${song.requester.tag}`)
            .setThumbnail(song.thumbnail)
        return this.send(embed)
    }

    nextInQueue() {
        if(!this.channel) return;
        const song = this.voice.queue.q[0]
        const embed = new RichEmbed()
            .setColor(constants.STYLE.embed.color)
            .setAuthor("Next in Queue", this.channel.client.user.avatarURL)
        if(!song)
            embed.setDescription("There's no more songs :c\nRequest some!")
                .setFooter("Powered by Patch")
        else 
            embed.setDescription(`**[${song.title}](${song.url})** \n*Length: ${formatSec(song.length)}*`)
                .setFooter(`Requested by ${song.requester.tag}`)
                .setAuthor("Next in Queue", song.requester.icon)
                .setThumbnail(song.thumbnail)
        this.reset()
        return this.send(embed)
    }

    queue() {
        if(!this.voice.queue.active) return;
        const queue = this.voice.queue.q.slice(0, 4)
        const now = this.voice.queue.active
        const embed = new RichEmbed()
            .setColor(constants.STYLE.embed.color)
            .setAuthor("Full Queue", this.channel.client.user.avatarURL)
            .setDescription(`Queue size: ${this.voice.queue.size} | Length: ${formatSec(this.voice.queue.length)}\nNow playing:\n**[${now.title}](${now.url})** requested by: *${now.requester.tag}*`) 
            .setFooter(`Powered by Patch`)
        queue.forEach((song, i) => {
            embed.addField(`#${i+1}`, `**[${song.title}](${song.url})** (${formatSec(song.length)})\n*requested by ${song.requester.tag}*`)
        })
        if(this.voice.queue.q.length > 4) embed.addField("And more...", '\u200B')
        this.reset()
        this.send(embed)
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
