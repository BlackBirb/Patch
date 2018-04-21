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
            icon: req.avatarURL
        }

        // use more of data
        // format time
    }

    get url() {
        return `https://www.youtube.com/watch?v=${this.id}`
    }
}
