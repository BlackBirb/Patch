const promisify = require("./Promisify")
const { mongoUrl } = require("../Utils/Constants.js")

class MongoManager {
    constructor(db) {
        this.db = db
        this.mongoDB = db.mongodb
    }

    close() {
        this.mongoDB.close()
    }
}

let manager = false

module.exports = function(client) {
    return new Promise((res, rej) => {
        if(manager) return res(manager)

        client.logger.loading("Connecting to mongoDB")
        promisify().connect(mongoUrl)
        .then(async db => {
            client.logger.ok("MongoDB connected!")
            manager = new MongoManager(db)
            res(manager)
        })
        .catch(err => {
            client.logger.error(err)
            rej(err)
        })
    })

}