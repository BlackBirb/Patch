const MongoClient = require('mongodb').MongoClient;
const { mongoUrl, defaults  } = require("../Utils/Constants.js")

class FakeManager { // for testing when i'm too lazy to start mongoDB
    logCommand() { return Promise.resolve(true) }
    updateSettings() { return Promise.resolve(true) }
    getSettings() { return Promise.resolve(false) }
    close() { return false }
    getUserPermissions() { return Promise.resolve(false) }
    setUserPermissions() { return Promise.resolve(true) }
    getUserAccount(id) { return Promise.resolve(Object.assign({}, { id }, defaults.userAccount)) }
    findResponse() { return Promise.resolve(null) }
    addResponse() { return Promise.resolve(false) }
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
            },
            "userSettings": {
                db: "settings",
                collection: "user"
            },
            "userAccounts": {
                db: "accounts",
                collection: "user"
            },
            "globalResponses": {
                db: "responses",
                collection: "global"
            },
            "userResponses": {
                db: "responses",
                collection: "user"
            },
            "guildResponses": {
                db: "responses",
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
        if(msg.channel.type === "text") {
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
        } else {
            return this.collection("cmdLogs").insertOne({
                command: cmd.name,
                user: {
                    id: msg.author.id,
                    username: msg.author.username,
                    discriminator: msg.author.discriminator
                },
                guild: null,
                channel: "DM",
                params: msg.params,
                timestamp: msg.createdTimestamp
            })
        }
    }

    async getSettings(id, type = "guild") {
        const settings = await this.collection(type+"Settings").findOne({ id })
        if(!settings) return settings
        delete settings.id
        delete settings._id
        return settings
    }

    async getUserPermissions(id) {
        const settings = await this.collection("userSettings").findOne({ id })
        if(!settings) return null
        return settings.permisisons
    }

    async setUserPermissions(id, permissions) {
        return this.collection("userSettings").updateOne({ id }, { $set: { permissions } })
    }

    async getUserAccount(id) {
        let acc = await this.collection("userAccounts").findOne({ id })
        if(!acc) {
            acc = { id, currency: 0 }
            await this.collection("userAccounts").insertOne(acc)
        }
        delete acc._id
        delete acc.id
        return acc
    }

    async findResponse(msg, authorID, guildID) {
        const global = await this.collection("globalResponses").findOne({
            query: msg
        })
        if(global) return global.responses
        if(authorID) {
            const user = await this.collection("userResponses").findOne({ 
                [authorID]: {
                    $elemMatch: {
                        query: msg
                    }
                }
            })
            if(user) return user[authorID][0].responses
        }
        if(guildID) {
            const guild = await this.collection("guildResponses").findOne({ 
                [guildID]: {
                    $elemMatch: {
                        query: msg
                    }
                }
            })
            if(guild) return guild[guildID][0].responses
        }
        
        return null
    }

    async addResponse(query, responses, type = "global", id) {
        if (type === "global") {
            return this.collection("globalResponses").updateOne(
                {
                    $or: [
                        { query },
                        { responses }
                    ]
                },
                {
                    $addToSet: {
                        query,
                        responses
                    }
                },
                { upsert: true }
            )
        }
        if (type === "user" || type === "guild") {
            if(await this.collection(type+"Responses").findOne({ [id]: { $exists : true } }))
                return this.collection(type + "Responses").updateOne(
                    {
                        $or: [
                            { [id]: { $elemMatch: { query } } },
                            { [id]: { $elemMatch: { responses } } }
                        ]
                    },
                    {
                        $addToSet: {
                            [`${id}.$[].query`]: query,
                            [`${id}.$[].responses`]: responses
                        }
                    }
                    // upsert doesn't work :C
                )
            else
                return this.collection(type+"Responses").insertOne({
                    [id]: [
                        {
                            query: [ query ],
                            responses: [ responses ]
                        }
                    ]
                })
        }
        return null
    }

    close() {
        this.mongoDB.close()
    }
}

let manager = false

// eslint-disable-next-line no-unused-vars
module.exports = function(client) {
    if(!client.config.run.mongo) return Promise.resolve(new FakeManager()) // for testing..
    
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
