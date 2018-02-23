const { failCommand } = require("../Utils/Constants.js")

module.exports = function(msg) {
    const { client } = msg
    const cmd = client.registry.find(msg.name)

    if(!cmd) return msg.react(failCommand)

    // check for subcommand
    let runAt = "run"
    if(msg.params) {
        let subCmd = `sub${msg.params[0]}`
        if(typeof this[subCmd] === "function") {
            msg.params.splice(0,1)
            runAt = subCmd
        }
    }

    cmd.process(msg, runAt)
    // check permissions
    // run command
}