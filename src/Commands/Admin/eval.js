const Command = require("../../Structures/Command.js")
const inspect = require("util").inspect

module.exports = class Eval extends Command {
    constructor(client, id) {
        super(client, id)
        
        this.name = "eval"
        this.aliases = ["do"]
        this.premissions = 0b1
        
        this.channels = ["text", "dm"]

        this.disabled = false

        this.types = { 
            "code": {
                required: true,
                err: "I need code to evaluate!"
            }
        }

        /**
         * Function that returns object!
         * 
         * Each guild will have it's own version of object returned by this.data, you can acces it in any command function just like it would be in this object, so `this.data`
         * 
         * @optional
         */
        this.data = () => ({
            "guildData": 0,
            "Itz test": "and it works"
        })
    }

    clear(text) {
        if(typeof text !== 'string') text = inspect(text, { depth: 0 });
		if(text.toString().length > 1800) text = text.substring(0,1800);
        return typeof text === 'string' ? text
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`)
            .replace(/[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g, '[NOPE]')
            : text;
    }

    async parse(start, res, code = "", err = false) {
        code = code.replace(/```/g, "`'`")
        if(err) {
            const splited = res.stack.split("\n")
            const index = splited.findIndex(v => v.trim().toLowerCase().startsWith("at eval"))
            return `*Crashed in ${Date.now() - start}ms*\n\`\`\`js\neval:0\n${code.trim()}\n^\n\n${splited.slice(0,index).join("\n")}\`\`\``
        }
        if(res instanceof Promise) {
            const executed = Date.now() - start
            const resolve = await res
            return `_Executed in ${executed}ms, **Promise** resolved in ${Date.now() - start}ms_\n\`\`\`js\n${this.clear(resolve)}\`\`\``
        }
        return `*Executed in ${Date.now() - start}ms*\n\`\`\`js\n${this.clear(res)}\`\`\``
    }
    
    async run(msg, params) {
        const start = Date.now()
        let parsed = null;
        if(params[0] === "nores") {
            const code = params.slice(1).join(" ")
            eval(code)
            return;
        }
        const code = params.string
        try {
            const evalved = eval(code)
            parsed = await this.parse(start, evalved)
        }
        catch(err) {
            parsed = await this.parse(start, err, code, true)
        }
        if(parsed === null) msg.reply("Ouch, really bad error!")
        msg.reply(parsed)
    }
}