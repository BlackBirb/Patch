module.exports = class Song {
    constructor(data, req) {
        this.id = data.id
        this.title = data.title
        this.length = parseInt(data.length)
        this.requester = {
            id: req.id,
            tag: req.tag
        }

        // use more of data
        // format time
    }

    get url() {
        return `https://www.youtube.com/watch?v=${this.id}`
    }
}