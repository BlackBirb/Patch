const https = require("https")
const express = require("express")
const fs = require('fs');
const path = require('path')
const WebSocketManager = require("./WebSocket/main.js")
const routes = require("./Routes.js")
const { port, useSSL } = require("./constants.json")

const options = {}
if(useSSL) {
    const sslPath = path.resolve(__dirname, '../ssl/')
    options.cert = fs.readFileSync(sslPath + '/localhost.crt'),
    options.key = fs.readFileSync(sslPath + '/localhost.key')
    const http = require("http")
    http.createServer((req, res) => {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(80);
}

const configureExpress = app => {
    app.enable('trust proxy');
    app.use(function(req, res, next) {
        if (req.secure){
            return next();
        }
        res.redirect("https://" + req.headers.host + req.url);
    });
    // why not?
    app.disable('x-powered-by');
    app.use((req, res, next) => {
        res.set({ 
            "powered-by": "Patch"
        }) 
        next();
    })
    app.use(routes)
}

module.exports = class WebInterface {
    constructor(client) {
        const expressApp = express()
        this.server = useSSL 
            ? https.createServer(options, expressApp) 
            : expressApp
        configureExpress(expressApp)
        this.webSocket = new WebSocketManager(client, this.server)
    }

    init() {
        return new Promise(resolve => {
            this.webSocket.listenToConnections()
            this.server.listen(port, () => {
                console.ok("Server is listening on port", port)
                resolve(true)
            })
        })
    }

    async terminate() {
        return new Promise(resolve => {
            this.webSocket.wss.clients.forEach(ws => ws.terminate())
            resolve(true)
        })
    }
}
