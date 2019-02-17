const Parameters = require("./Parameters.js")

const passInhib = (inhib, ...data) => inhib(...data) !== false

module.exports = class Command {
    constructor(client, id) {
        this.client = client
        this.name = null
        this.id = id
        this.types = false
        this.group = "unassigned"
        this.permissions = client.constants.PERMISSIONS.DEFAULT
        this.ignoreBlacklist = false
        this.allInhibitors = []
    }

    init() {
        if(typeof this.inhibitor === "function") 
            this.allInhibitors.push(this.inhibitor.bind(this))
        if(typeof this.inhibitors === "object") {
            for(const key in this.inhibitors) { // works for arrays and objects
                this.allInhibitors.push(this.inhibitors[key].bind(this))
            }
        }
    }

    guildOptions(guild) {
        if(!guild) return {}
        let data = guild.commandData[this.id]
        if(!data)
            data = guild.createCmdData(this)
        return data
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
            }
            if(msg.params && formated.length < msg.params.length) {
                for(let i=formated.length-1;i<msg.params.length;i++) {
                    formated[i] = msg.params[i]
                }
            }
            params = new Parameters(formated)
        }

        /**
         * @constant CommandUtils
         * Utils that command gets as 3rd param
         * @param voice Guild specific voice manager
         * @param voiceManager Voice manager class, for static methods
         * @param utils Utils form client.utils
         * @param deleteMessage ment to be added to .then() it will delete message after 30s
         */
        const CommandUtils = {
            voice: msg.guild ? msg.guild.voice : null,
            voiceManager: this.client.VoiceManager,
            utils: this.client.utils,
            deleteMessage: m => m.delete({ timeout: 30000 })
        }

        this.data = this.guildOptions(msg.guild)

        if(this.allInhibitors.length > 0) {
            for(const inhib of this.allInhibitors)
                if(!passInhib(inhib, msg, params, CommandUtils)) return;
        }

        return this[runAt](msg, params, CommandUtils)
    }
}
