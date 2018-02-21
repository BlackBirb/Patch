const Discord = require("discord.js")
const fs = require("fs")
const path = require("path")

module.exports = class Registry {
    constructor(client) {
        this.client = client

        this.aliases = new Discord.Collection()
        this.commands = new Discord.Collection()
    }
    fetch() {
        const folder = path.resolve(__dirname, "../../Commands")
        const dir = fs.readdirSync(folder)
        const folders = dir.filter(f => fs.statSync(path.join(folder, f)).isDirectory())
        const files = dir.filter(f => !folders.includes(f))
        this.addGroup("global",files)
        for(const folder of folders) {
            const newPath = path.resolve(__dirname, "../../Commands", folder)
            const cmdFiles = fs.readdirSync(newPath)
            this.addGroup(folder,cmdFiles)
        }
    }

    addGroup(name, files) {
        for(const command of files) {
            const CommandClass = require("../../Commands/"+command)
            this.register(CommandClass, name)
        }
    }

    createKey() { 
        let key = "1c"
        for(let i=0;i<32;i++) {
            key += Math.floor(Math.random()*10)
        }
        if(this.commands.has(key)) return this.createKey()
        return key
    }

    register(Command, group) {
        const { name } = Command
        if(this.aliases.has(name)) throw new ReferenceError(`Command ${name} already exists!`)
        const cmd = new Command(this.client, this.createKey())
        cmd.group = group
        this.aliases.set(cmd.name, cmd.id)
        if(cmd.aliases)
            for(const alias of cmd.aliases) {
                this.aliases.set(alias, cmd.id)
            }
        this.commands.set(cmd.id, cmd)
    }

    find(name) {
        const id = this.aliases.get(name)
        return this.commands.get(id)
    }
}