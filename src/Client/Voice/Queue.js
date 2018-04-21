module.exports = class Queue {
    constructor() {
        this.q = new Array()
        this.active = null
    }

    clear() {
        this.q = new Array()
        this.active = null
    }

    add(song) {
        this.q.push(song)
        return this
    }

    move() {
        if(this.q.length > 0)
            this.active = this.q.shift()
        else
            this.active = null
        return this.now
    }

    get now() {
        return (this.active && this.active.track) || null
    }

    get size() {
        return this.q.length
    }

    get fullQueue() {
        if(!this.active) return []
        return [this.active, ...this.q]
    }

    get length() {
        return this.fullQueue.reduce((a, b) => a + b.length, 0)
    }
}
