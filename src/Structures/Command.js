module.exports = class Command {
    constructor(client, id) {
        this.client = client
        this.id = id
        this.types = false
        this.group = "unassigned"
    }

    process(msg) {
        // check for subcommand
        let runAt = "run"
        if(msg.params) {
            let subCmd = `sub${msg.params[0]}`
            if(typeof this[subCmd] === "function") {
                msg.params.splice(0,1)
                runAt = subCmd
            }
        }

        this[runAt](msg, msg.params, msg.name)
    }
}