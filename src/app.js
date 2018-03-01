const Discord = require("./Client/D.js");
const fs = require("fs")
const utils = require("./Client/Utils/Main.js")
const constants = require("./Client/Utils/Constants.js")
const CommandRegistry = require("./Client/Registry/Manager.js")
const dbManager = require("./Client/db/Manager.js")

module.exports = class Bot extends Discord.Client {
    constructor(config) {
        super(config.clientSettings)
        this.config = config
        this.utils = utils
        this.constants = constants

        this.waitForServices()
        this.logger = require("./Client/Utils/Logger.js");
        dbManager(this).then(db => {
            this.db = db 
            this.emit("readyMongoDB")
        })

        this.registry = new CommandRegistry(this)

        this.registry.fetch().then(() => this.emit("readyCommands")) // maybe tey will take some tile to load? I doubt it but still.

        if (!config.testing) {
            this.login(config.token)
        } else
            this.emit("ready", "Fake ready event.")

        this.once("ready", () => this.emit("readyDiscordJS"))

        this.once("initialized", () => this.start()) // wait for all services to load, connect etc.
    }

    waitForServices() {
        const { asyncServices } = constants
        const ready = []

        const check = () => {
            if(ready.length >= asyncServices.length) 
                return this.emit("initialized")
        }

        for(const service of asyncServices) {
            this.once("ready"+service, () => { 
                ready.push(service) 
                check()
            })
        }
    }

    start() {
        this.logger.ok("All services ready, starting.")
        this.loadEvents()
    }

    loadEvents() {
        this.logger.loading("Loading events...")
        this.events = new Discord.Collection()
        const getPath = this.utils.pathGetter(__dirname, "./Client/Events")
        const events = fs.readdirSync(getPath())
        for (const evn of events) {
            const cb = require(getPath(evn)).bind(this)
            const name = evn.slice(0, -3)
            this.events.set(name, cb)
            this.on(name, cb)
        }
        this.logger.ok(`${this.events.size} events loaded.`)
    }
}