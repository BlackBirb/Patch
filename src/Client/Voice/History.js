module.exports = class Queue {
    constructor(m) {
        this.his = new Array()
        this.maxLength = m | 5
    }

    clear() {
        this.his = new Array()
    }

    push(song) {
        this.his.unshift(song)
        while(this.his.length > this.maxLength)
            this.his.pop()
        return this
    }

    get last() {
        return this.his[0] || null
    }

    get length() {
        return this.his.length
    }
}
