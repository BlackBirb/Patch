const MongoClient = require('mongodb').MongoClient;

class PromisifiedMongoClient {
    constructor(database) {
        this.mongodb = database;
    }

    static connect(url) {
        return new Promise((res, rej) => {
            MongoClient.connect(url, (err, client) => {
                if(err) return rej(err)
                res(new PromisifiedMongoClient(client))
            })
        })
    }
}

module.exports = function(db) {
    if(!db) return PromisifiedMongoClient
    return PromisifiedMongoClient(db)
}