const { failCommand } = require("../Utils/Constants.js")

module.exports = function(msg) {
    const cmd = this.registry.find(msg.name)

    if(!cmd) return msg.react(failCommand)

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

    cmd.process(msg, runAt)
    // check permissions
}