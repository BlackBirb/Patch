const snekfetch = require("snekfetch");
const ytdl = require("ytdl-core")
const config = require("../../../config.json")
const { youtubeToken } = config
const Song = require("./Song.js")
const Queue = require("./Queue.js")
const History = require("./History.js")
const Messenger = require("./Messenger.js")
const constants = require("../Utils/Constants.js").VOICE
const codes = constants.codes

module.exports = class VoiceManager {
    constructor(g) {
        this.client = g.client
        this.guild = g
        this.manager = g.client.VoicePlayer
        this.player = null
        this.queue = new Queue()
        this.history = new History(constants.historyLength)
        this.msg = new Messenger(this)
        this.voiceChannel = null

        this.autoLeave = {
            _timeout: null,
            Timeout: () => {
                if(this.playing) return;
                if(this.player)
                    this.leave()
            },
            start: function () {
                this._timeout === null 
                    && (this._timeout = setTimeout(this.Timeout, constants.autoLeave))
            },
            stop: function () { 
                if(this._timeout !== null) {
                    clearTimeout(this._timeout)
                    this._timeout = null
                }
            }
        }
        Object.defineProperty(this.autoLeave, "active", { get: function() { return this._timeout !== null } })
    }

    get playing() {
        return this.player && this.player.playing
    }

    join(channel) {
        if(!channel.permissions.has(["CONNECT","SPEAK","USE_VAD"])) return Promise.reject({ code: codes.noPermissions, err: "No permissions"})
        if(channel.guild.id !== this.guild.id) return Promise.reject({ code: codes.differentGuild , err: "Channel is in different guild"})
        if(channel.full) return Promise.reject({ code: codes.fullChannel , err: "Channel is full"})
        this.voiceChannel = channel

        if(this.player && channel.id !== this.player.channel)
            this.player.updateVoiceState(channel.id)
        
        return this.manager.join({
            guild: this.guild.id,
            channel: channel.id,
            host: "localhost"
        }).then(player => {
            this.autoLeave.start()
            this.player = player
            player.on("error", console.error);
        });
    }

    addSong(song) {
        this.queue.add(song)
        if(this.playing) return this.msg.enqueued(song)
        if(this.autoLeave.active) this.autoLeave.stop()
        this.queue.move()
        return this.play()
    }

    play() {
        if(!this.player) return this.msg.err("Emm, I think you were too slow and I left... Sorry '^^")
        if(!this.queue.now) return this.msg.err("No more songs to play!")

        this.queue.active.playingTimestamp = new Date();
        this.player.play(this.queue.now)
            .once("end", this.songEnded.bind(this))
        
        this.msg.nextSong(this.queue.active)
        return this
    }

    songEnded(evn) {
        this.history.push(this.queue.active)
        const move = this.queue.move()
        if(evn.reason === 'STOPPED') return;
        if(!move) {
            this.autoLeave.start()
            return this.msg.queueEnd()
        }
        this.play()
    }

    async leave() {
        const wait = this.msg.channelLeave().then(() => this.msg.setChannel(null))
        if(this.playing) this.player.stop()
        this.queue.clear()
        this.manager.leave(this.guild.id);
        this.player = null
        return wait
    }

    static getTrack(song) {
        return snekfetch.get(`http://${config.lavalink.host}:${config.lavalink.port}/loadtracks`)
        .query({ identifier: song })
        .set("Authorization", config.lavalink.password)
        .then(r => r.body[0].track)
    }

    static songInfo(id, author) {
        return Promise.all([
            ytdl.getInfo(id),
            this.getTrack(id)
        ])
        .then(([ info, track ]) => {
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
            return new Song(data, author, track)
        })
        
    }

    static find(query) {
        const options = {
            q: query,
            part: 'snippet',
            maxResults: 5,
            type: 'video',
            key: youtubeToken
        }
        return snekfetch.get(`https://www.googleapis.com/youtube/v3/search`)
            .query(options)
            .then(res => {
                const data = res.body.items.map(song => ({
                    id: song.id.videoId,
                    title: song.snippet.title,
                    channel: {
                        id: song.snippet.channelId,
                        name: song.snippet.channelTitle
                    }
                }))
                return data
            })
    }
}
