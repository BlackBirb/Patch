const MongoClient = require('mongodb').MongoClient;
const { mongoUrl } = require("../Utils/Constants.js")

class FakeManager { // for testing when i'm too lazy to start mongoDB
    logCommand() { return Promise.resolve(true) }
    createSettings() { return Promise.resolve(true) }
    updateSettings() { return Promise.resolve(true) }
    removeSettinngs() { return Promise.resolve(true) }
    getSettings() { return Promise.resolve(false) }
    close() { }
}

class MongoManager {
    constructor(db) {
        this.db = db
        /**
         *  shortName: {
         *      db: "db name",
         *      collection: "collection name"
         *  }
         */
        this.collections = {
            "cmdLogs": {
                db: "logs",
                collection: "commands"
            },
            "guildSettings": {
                db: "settings",
                collection: "guild"
            }
        }
    }

    collection(name) {
        if(!this.collections.hasOwnProperty(name)) return console.error("Tried to use collection that doesn't exists!")
        const coll = this.collections[name]
        return this.db.db(coll.db).collection(coll.collection)
    }

    async logCommand(cmd, msg) {
        return this.collection("cmdLogs").insertOne({
            command: cmd.name,
            user: {
                id: msg.author.id,
                username: msg.author.username,
                discriminator: msg.author.discriminator
            },
            guild: {
                id: msg.guild.id,
                name: msg.guild.name
            },
            channel: {
                id: msg.channel.id,
                name: msg.channel.name
            },
            params: msg.params,
            timestamp: msg.createdTimestamp
        })
    }

    createSettings(id) { 
        return this.collection("guildSettings").insertOne({ id })
    }

    // eslint-disable-next-line no-unused-vars
    updateSettings(id, settings) {
        return this.collection("guildSettings").updateOne({ id }, { $set: settings })
    }

    removeSettinngs(id) {
        return this.collection("guildSettings").removeOne({ id })
    }

    async getSettings(id) {
        const settings = await this.collection("guildSettings").findOne({ id })
        if(!settings) return settings
        delete settings.id
        delete settings._id
        return settings
    }

    close() {
        this.mongoDB.close()
    }
}

let manager = false

// eslint-disable-next-line no-unused-vars
module.exports = function(client) {
    if(!client.config.useDB) return Promise.resolve(new FakeManager()) // for testing..

    return new Promise((res, rej) => {
        if(manager) {
            console.warn("MongoDB manager is already created!")
            return res(manager)
        }
        

        console.loading("Connecting to mongoDB")
        MongoClient.connect(mongoUrl)
        .then(db => {
            console.ok("MongoDB connected!")
            manager = new MongoManager(db)
            res(manager)
        })
        .catch(err => {
            console.error(err)
            rej(err)
        })
    })

}