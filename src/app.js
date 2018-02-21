const Discord = require("./Client/D.js");
const fs = require("fs")
const utils = require("./Client/Utils/Main.js")
const constants = require("./Client/Utils/Constants.js")
const CommandRegistry = require("./Client/Registry/Manager.js")

module.exports = class Bot extends Discord.Client {
    constructor(config) {
        super(config.clientSettings)
        this.config = config
        this.utils = utils
        this.constants = constants

        this.registry = new CommandRegistry(this)


        this.loadEvents()
        this.registry.fetch()

        if(!config.testing) {
            this.login(config.token)
        }
        else
            this.emit("ready", "Fake ready event.")
    }

    loadEvents() {
        this.events = new Discord.Collection()
        const getPath = this.utils.pathGetter(__dirname, "./Client/events")
        const events = fs.readdirSync(getPath())
        for(const evn of events) {
            const cb = require(getPath(evn))
            const name = evn.slice(0,-3)
            this.events.set(name, cb)
            this.on(name, cb)
        }
    }
}