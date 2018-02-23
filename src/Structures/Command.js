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

        let types = this.types
        if(types) {

            if(runAt === "run") {
                if(this.types.run) types = this.types.run
            } 
            else if(this.types[runAt.slice(3)]) // .slice(3) to remove `sub`
                types = this.types[runAt.slice(3)]
            else 
                types = null
        }

        if(types) {
            const formated = []
            const entries = Object.entries(types)
            for(let i=0;i<entries.length;i++) {
                const [name, opt] = entries[i]
                if(msg.params === null || msg.params[i] === undefined) { 
                    if(opt.required)
                        return msg.reply(opt.err || `Uh... You forgot to add ${name}`)
                }
                else 
                    formated.push({name, value: msg.params[i]})
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