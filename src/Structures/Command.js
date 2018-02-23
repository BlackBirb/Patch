const Parameters = require("./Parameters.js")

module.exports = class Command {
    constructor(client, id) {
        this.client = client
        this.id = id
        this.types = false
        this.group = "unassigned"
    }

    async process(msg, runAt = "run") {

        let params = new Parameters(msg.params)
        if(this.types) {
            const formated = []
            const entries = Object.entries(this.types)
            for(let i=0;i<entries.length;i++) {
                const [name, opt] = entries[i]
                if(opt.required && (msg.params === null || msg.params[i] === undefined)) 
                    return msg.reply(opt.err || `Uh... You forgot to add ${name}`)
                if(msg.params !== null && msg.params[i]) formated.push({name, value: msg.params[i]})
                // i really don't like checking if params are null so many times, need fix
            }
            if(msg.params && formated.length < msg.params.length) {
                for(let i=formated.length-1;i<msg.params.length;i++) {
                    formated[i] = msg.params[i]
                }
            }
            params = new Parameters(formated)
        }

        return this[runAt](msg, params, msg.name)
    }
}