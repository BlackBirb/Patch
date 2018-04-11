module.exports = class VoiceMessenger {
    constructor(manager) {
        this.voice = manager
        this.channel = null
    }

    enqueued(song) {
        if(!this.channel) return;
        this.channel.send(`Enqueued **${song.title}** song! \`[${song.length}]\` by ***${song.requester.tag}***\n   *Queue size: ${this.voice.queue.size} | Queue length: ${this.voice.queue.length}*`)
    }

    nextSong(song) {
        if(!this.channel) return;
        this.channel.send(`Now playing **${song.title}**! \`[${song.length}]\` requested by *${song.requester.tag}*`)
    }

    queueEnd() {
        if(!this.channel) return;
        this.channel.send(`Queue ended! Give me more music!`)
    }

    err(text) {
        if(!this.channel) return;
        this.channel.send(text)
    }

    setChannel(channel) {
        this.channel = channel
        return this
    }
}
