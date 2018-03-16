const { LOGGER_SPACING } = require("./Constants.js")

class Logger {
    constructor() {
        this.bold = { open: '\u001b[1m', close: '\u001b[22m' }
        this.black = { open: '\u001b[30m', close: '\u001b[39m' }
        this.red = { open: '\u001b[31m', close: '\u001b[31m' }
        this.green = { open: '\u001b[32m', close: '\u001b[39m' }
        this.yellow = { open: '\u001b[33m', close: '\u001b[39m' }
        this.blue = { open: '\u001b[34m', close: '\u001b[39m' }
        this.magenta = { open: '\u001b[35m', close: '\u001b[39m' }
        this.cyan = { open: '\u001b[36m', close: '\u001b[39m' }
        this.white = { open: '\u001b[37m', close: '\u001b[39m' }
        this.gray = { open: '\u001b[90m', close: '\u001b[39m' }
        this.grey = { open: '\u001b[90m', close: '\u001b[39m' }

        this.spacing = LOGGER_SPACING
    }

    add(color, text) {
        if(this[color]) {
            const { open, close } = this[color]
            return open + text + close
        }
        return text
    }

    end(str, msg) {
        let len = this.spacing - str.length
        return " ".repeat(len > 0 ? len : 0) + msg
    }

    addTime(str) {
        let time = this.add("bold", `[${new Date().toLocaleString()}]`)
        return `${time} ${str}`
    }

    addToConsole(fn) {
        console[fn.name] = fn.bind(this)
    }



    undefined(text, ending = { color: "red", text: "Error" }) {
        const msg = this.addTime(text)
        const end = this.end(msg, `[${this.add(ending.color, ending.text)}]`)
        console.log(msg + end)
    }

    error(...text) {
        const str = text.join(" ")
        this.undefined(str, { color: "red", text: "Error" })
        return str
    }

    loading(...text) {
        const str = text.join(" ")
        this.undefined(str, { color: "yellow", text: "Loading"})
        return str
    }

    loaded(...text) {
        const str = text.join(" ")
        this.undefined(str, { color: "green", text: "Loaded"})
        return str
    }

    ok(...text) {
        const str = text.join(" ")
        this.undefined(str, { color: "green", text: "OK"})
        return str
    }

    info(...text) {
        const str = text.join(" ")
        this.undefined(str, { color: "grey", text: "INFO"})
        return str
    }
    warn(...text) {
        const str = text.join(" ")
        this.undefined(str, { color: "yellow", text: "Warn" })
        return str
    }

    init() {
        console.undefined = this.undefined.bind(this)
        this.addToConsole(this.error)
        this.addToConsole(this.loading)
        this.addToConsole(this.loaded)
        this.addToConsole(this.ok)
        this.addToConsole(this.info)
        return this
    }
}

const logger = new Logger().init()
module.exports = logger