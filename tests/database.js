// this is more for a manual testing
const MongoClient = require('mongodb').MongoClient;
const { mongoUrl } = require("../src/Client/Utils/Constants.js");


module.exports = new (class Manager {
    constructor() {
        this.db = null
        MongoClient.connect(mongoUrl).then(db => {
            this.db = db
            console.log("Ready!")
        })
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
    
})()
