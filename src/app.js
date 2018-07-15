const UpdateDiscord = require("./Client/D.js");
const fs = require("fs")
const utils = require("./Client/Utils/Main.js")
const constants = require("./Client/Utils/Constants.js")
const CommandRegistry = require("./Client/Registry/Manager.js")
const dbManager = require("./Client/db/MongoManager.js")

const Discord = UpdateDiscord()
module.exports = class Bot extends Discord.Client {
    constructor(config, WebInterface) {
        super(config.clientSettings)
        this.config = config
        this.utils = utils
        this.constants = constants
        this.logger = require("./Client/Utils/Logger.js");
        this.VoiceManager = require("./Client/Voice/Manager.js")
        this.VoicePlayer = null

        this.waitForServices()
        this.db = null
        dbManager(this).then(db => {
            this.db = db 
            this.emit("readyMongoDB")
        })

        this.registry = new CommandRegistry(this)

        this.registry.fetch().then(() => this.emit("readyCommands")) // maybe tey will take some tile to load? I doubt it but still.

        if(!config.run.web || typeof WebInterface !== 'function') {
            this.webInterface = null
            this.emit("readyWeb")
        } else {
            console.log("wat")
            this.webInterface = new WebInterface(this)
            this.webInterface.init().then(() => this.emit("readyWeb"))
        }

        if (config.run.discord) {
            this.login(config.token)
        } else
            this.emit("ready", "Fake ready event.")

        this.once("ready", () => this.emit("readyDiscordJS"))

        this.once("initialized", () => this.start()) // wait for all services to load, connect etc.
    }

    waitForServices() {
        const { asyncServices } = constants
        const ready = []
        console.loading("Waiting for services:",asyncServices.join(", "))
        const check = () => {
            if(ready.length >= asyncServices.length) 
                return this.emit("initialized")
        }

        for(const service of asyncServices) {
            this.once("ready"+service, () => { 
                console.loaded("Service",service,"is ready!")
                ready.push(service) 
                check()
            })
        }
    }

    start() {
        console.ok("All services ready, starting.")
        this.loadEvents()
        this.openCLI()
    }

    loadEvents() {
        console.loading("Loading events...")
        this.events = new Discord.Collection()
        const getPath = this.utils.pathGetter(__dirname, "./Client/Events")
        const events = fs.readdirSync(getPath())
        for (const evn of events) {
            const cb = require(getPath(evn)).bind(this)
            const name = evn.slice(0, -3)
            this.events.set(name, cb)
            this.on(name, cb)
        }
        console.ok(`${this.events.size} events loaded.`)
        this.emit("ready") // im stupid
    }

    openCLI() {
        const cli = require("./cli.js")
        cli.open(cli.createScope(this))
    }

    async terminate() {
        console.loading("Disconnecting from voice")
        await Promise.all(this.guilds.filter(g => g.voice && !!g.voice.connection).map(g => g.voice.leave()))
        console.loading("Closing connection with MongoDB")
        await this.db.destroy()
        if(this.webInterface) {
            console.loading("Terminating Web app")
            await this.webInterface.terminate()
        }
        console.loading("Destroying client")
        await this.destroy()
        return true
    }
}
