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
        return (this.active && this.active.url) || null
    }

    get size() {
        return this.q.length
    }

    get length() {
        if(this.q.length < 1) return 0
        if(this.q.length === 1 ) return this.q[0].length 
        return this.q.reduce((a, b) => a.length + b.length)
    }
}
