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

    cmd.process(msg, runAt)
    // check permissions
}