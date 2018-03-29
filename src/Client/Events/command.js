const { failCommand } = require("../Utils/Constants.js")

const messages = {
    noPerm: ["Sorry but I'm not going to listen to you."]
}

module.exports = async function(msg) { // fix this
    if(!msg.guild.settings.active) return;
    if(msg.guild.settings.blacklistedChannels.includes(msg.channel.id)) return;

    const cmd = this.registry.find(msg.command)

    if(!cmd) {
        if(msg.channel.type === "text") {
            const tag = msg.guild.tag(msg.command, msg)
            if(tag !== null)
                return msg.channel.send(tag)
        }
        return msg.react(failCommand)
    }
    this.db.logCommand(cmd, msg)

    // check for subcommand
    let runAt = "run"
    if(msg.params) {
        let subCmd = `sub${msg.params[0]}`
        if(typeof cmd[subCmd] === "function") {
            msg.params.splice(0,1)
            if(msg.params.length < 1) msg.params = null
            runAt = subCmd
        }
    }

    if(cmd.channels) {
        if(!cmd.channels.includes(msg.channel.type)) 
            return msg.reply("You can't use this command on this channel, sorry :c")
    }
    if(cmd.requiredPermissions && msg.channel.type === "text") {
        const perms = msg.channel.permissions
        if(Array.isArray(cmd.requiredPermissions)) {
            for(const permission of cmd.requiredPermissions) {
                if(!perms.has(permission)) return msg.reply(`How am I supposed to do that if you don't allow me to \`${permission}\`? Give me that channel permission!`)
            }
        } else if(typeof cmd.requiredPermissions === "string") {
            if(!perms.has(cmd.requiredPermissions)) return msg.reply(`How am I supposed to do that if you don't allow me to \`${cmd.requiredPermissions}\`? Give me that channel permission!`)
        } else throw new TypeError("Channel required permissions must be string or array!\nCommand "+cmd.name)
    }

    // check permissions +
    if(msg.author.id !== this.config.authorID) {
        let user = await msg.author.permissions
        let perms = false
        if(msg.channel.type !== "text")
            perms = user["GLOBAL"]
        else if(user.hasOwnProperty(msg.guild.id))
            perms = user[msg.guild.id]
        else
            perms = msg.guild.settings.defaultPermissions

        if(perms !== this.constants.PERMISSIONS.FULL_ADMIN) {
            if((perms & cmd.permissions) !== cmd.permissions) 
                return msg.reply(this.utils.pickRandom(messages.noPerm))
        }
    }

    cmd.process(msg, runAt)
}
