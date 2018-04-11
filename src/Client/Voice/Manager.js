const ytdl = require("ytdl-core")
const request = require("request")
const querystring = require("querystring");
const { youtubeToken } = require("../../../config.json")
const Song = require("./Song.js")
const Queue = require("./Queue.js")
const Messenger = require("./Messenger.js")
const constants = require("../Utils/Constants.js").VOICE
const codes = constants.codes

module.exports = class VoiceManager {
    constructor(g) {
        this.guild = g
        this.playing = false
        this.queue = new Queue() // etc.
        this.connection = null
        this.msg = new Messenger(this)
    }

    join(channel) {
        if(!channel.permissions.has(["CONNECT","SPEAK","USE_VAD"])) return Promise.reject({ code: codes.noPermissions, err: "No permissions"})
        if(channel.guild.id !== this.guild.id) return Promise.reject({ code: codes.differentGuild , err: "Channel is in different guild"})
        if(channel.full) return Promise.reject({ code: codes.fullChannel , err: "Channel is full"})
        return channel.join()
            .then(conn => {
                this.connection = conn
                return this
            })
            .catch(err => {
                console.error("Error when connecting to voice channel at guild",this.guild.id)
                throw err
            })
    }

    addSong(song) {
        this.queue.add(song)
        if(this.playing) return this.msg.enqueued(song)
        this.queue.move()
        return this.play()
    }

    play() {
        if(!this.connection) return this.msg.err("I'm... not connected? What?")
        if(!this.queue.now) return this.msg.err("No more songs to play!")

        const stream = ytdl(this.queue.now, constants.ytdlOptions)
        this.connection.playStream(stream, this.guild.settings.voice)
            .once("end", this.songEnded.bind(this))
        
        this.playing = true
        this.msg.nextSong(this.queue.active)
        return this
    }

    songEnded() {
        this.playing = false
        const move = this.queue.move()
        if(!move) return this.msg.queueEnd()
        this.play()
    }

    leave(channel) {
        if(this.playing) return false
        this.playing = false
        if(this.dispatcher) this.dispatcher.end('leave')
        this.connection.disconnect()
        this.queue.clear()
        if(channel) channel.leave()
        else this.voiceChannel.leave()
        this.connection = null
        this.msg.setChannel(null)
        return true
    }

    get dispatcher() {
        return (this.connection && this.connection.dispatcher) || null
    }

    get voiceChannel() {
        return (this.connection && this.connection.channel) || null
    }

    static songInfo(id, author) {
        return ytdl.getInfo(id).then(info => {
            const data = {
                id: id,
                title: info.title,
                length: info.length_seconds,
                views: info.view_count,
                thumbnail: info.thumbnail_url,
                author: {
                    name: info.author.name,
                    url: info.author.channel_url
                }
            }
            return new Song(data, author)
        })
        
    }

    static find(query) {
        return new Promise((resolve, reject) => {
            const options = {
                q: query,
                part: 'snippet',
                maxResults: 5,
                type: 'video',
                key: youtubeToken
            }
            request(`https://www.googleapis.com/youtube/v3/search?${querystring.stringify(options)}`, { method: "GET", json: true }, (err, res) => {
                if(err) reject(err)
                const data = res.body.items.map(song => ({
                    id: song.id.videoId,
                    title: song.snippet.title,
                    channel: {
                        id: song.snippet.channelId,
                        name: song.snippet.channelTitle
                    }
                }))
                return resolve(data)
            })
        })
    }
}
