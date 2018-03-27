const Discord = require("discord.js")
const fs = require("fs")
const path = require("path")

module.exports = class Registry {
    constructor(client) {
        this.client = client

        this.groups = new Set()
        this.aliases = new Discord.Collection()
        this.commands = new Discord.Collection()
        this.registeredPaths = new Map()
    }
    async fetch() {
        console.loading("Fetching commands...")
        const folder = path.resolve(__dirname, "../../Commands")
        const dir = fs.readdirSync(folder)
        const folders = dir.filter(f => fs.statSync(path.join(folder, f)).isDirectory())
        const files = dir.filter(f => !folders.includes(f))
        this.addGroup("global",files)
        for(const folder of folders) {
            const newPath = path.resolve(__dirname, "../../Commands", folder)
            const cmdFiles = fs.readdirSync(newPath).map(e => path.join(folder,e))
            this.addGroup(folder,cmdFiles)
        }
        console.ok(`${this.commands.size} commands loaded in ${this.groups.size} groups.`)
        return true
    }

    addGroup(name, files) {
        this.groups.add(name)
        for(const command of files) {
            const path = "../../Commands/"+command
            const CommandClass = require(path)
            this.register(CommandClass, name, path)
        }
    }

    createKey() { 
        // if(this.commands.size > 99999999999999999999999999999999) throw new Error("Too many commands! No id avaible! xD")
        let key = "1c"
        for(let i=0;i<32;i++) {
            key += Math.floor(Math.random()*10)
        }
        if(this.commands.has(key)) return this.createKey()
        return key
    }

    register(Command, group, path) {
        const { name } = Command
        if(this.aliases.has(name)) throw new ReferenceError(`Command ${name} already exists!`)
        const cmd = new Command(this.client, this.createKey())
        if(cmd.disabled) return;
        cmd.group = group
        this.aliases.set(cmd.name, cmd.id)
        if(cmd.aliases)
            for(const alias of cmd.aliases) {
                this.aliases.set(alias, cmd.id)
            }
        this.commands.set(cmd.id, cmd)
        this.registeredPaths.set(cmd.id, path)
    }

    find(name) {
        const id = this.aliases.get(name)
        return id && this.commands.get(id)
    }

    reload(cmd = null) {
        if(!cmd) {
            this.registeredPaths.forEach(p => delete require.cache[require.resolve(p)])
            this.commands.forEach((v, k) => this.commands.delete(k))
            this.aliases.forEach((v, k) => this.aliases.delete(k))
            return this.fetch().then(() => Promise.resolve(console.ok("Commands reloaded!") || true))
        } else if(typeof cmd === "string") {
            const command = this.find(cmd)
            if(!command) return false;

            const path = this.registeredPaths.get(command.id)

            this.commands.delete(command.id) // delete object from registry cache
            if(command.aliases) 
                for(const alias of command.aliases) // delete aliases
                    this.aliases.delete(alias)

            delete require.cache[require.resolve(path)] // delete from requrie cachce

            this.register(require(path), command.group, path)
            return Promise.resolve(console.ok(`Command ${command.name} reloaded!`) || true)
        }
    }
}