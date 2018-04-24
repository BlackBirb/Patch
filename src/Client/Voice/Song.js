module.exports = class Song {
    constructor(data, req, track) {
        this.id = data.id
        this.track = track
        this.title = data.title
        this.length = parseInt(data.length)
        this.views = data.views
        this.thumbnail = data.thumbnail
        this.requester = {
            id: req.id,
            tag: req.tag,
            icon: req.avatarURL()
        }

        this.playedAt = 0

        // use more of data
        // format time
    }

    set playingTimestamp(timestamp) {
        this.playedAt = timestamp
        this.playedDate = new Date(timestamp).toLocaleString().split(" ")[1].slice(0,-3)
    }

    get url() {
        return `https://www.youtube.com/watch?v=${this.id}`
    }
}
