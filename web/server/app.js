const WebSocketServer = require('uws').Server;
const constants = require("./constants.json")
const opCodes = constants.OP

module.exports = class WebInterface {
    constructor(client) {
        this.constants = constants
        this.client = client
        this.wss = new WebSocketServer({ port: 3000 });
        this._hinterval = setInterval(() => this.heartbeat(null), this.constants.heartbeatInterval)
        this.listenToConnections()
    }

    send(ws, msg, data) {
        let message;
        if(typeof msg === 'string' && data) {
            message = {
                op: opCodes.dispatch,
                t: msg,
                d: data
            }
        }
        if(typeof msg === 'object') 
            message = msg

        if(message)
            return ws.send(JSON.stringify(message))
        
        throw new Error(`Invalid websocket message!\nTypes: ${typeof msg}, ${typeof data}\nmsg:\n${msg}\ndata:\n${data}`)
        
    }

    listenToConnections() {
        this.wss.on("connection", ws => {
            ws.alvie = true
            this.send(ws, { op: opCodes.hello, d: { heartbeatInterval: constants.heartbeatInterval } })
            ws.identified = false
            ws.on("message", data => {
                try {
                    const msg = JSON.parse(data)
                    this.message(ws, msg)
                } catch(err) {
                    // nothing
                }
            })
            ws.on("close", () => ws.alive = false)
        })
    }

    message(ws, msg) {
        if(!msg.op || typeof msg.op !== 'number') 
            return this.send(ws, { op: opCodes.invalidMsg, error: "Missing or invalid op code"})
        switch(msg.op) {
            case opCodes.identify: {
                // Make some real identifying
                ws.identified = true
                ws.alive = true
                this.send(ws, "Ready", { welcome: ":)" })
                break;
            }
            case opCodes.heartbeat: {
                if(!ws.identified) return;
                this.heartbeat(ws)
                break;
            }
        }
    }

    heartbeat(ws) {
        if(!ws) {
            this.wss.clients.forEach(ws => {
                if(!ws.alive) {
                    return ws.terminate()
                }
                ws.alive = false
            })
            return;
        }
        ws.alive = true
        this.send(ws, { op: opCodes.heartbeatACK })
    }

    async terminate() {
        return new Promise(resolve => {
            this.wss.clients.forEach(ws => ws.terminate())
            resolve(true)
        })
    }
}

/* 
// Testing // 
var int = null
var ws = new WebSocket("ws://localhost:3000/")
ws.addEventListener("message", evn => {
    const data = JSON.parse(evn.data)
    console.log(data)
    if(data.op === 1) {
        ws.send(JSON.stringify({ op: 2, d: "Hi!" }))
        if(int) {
            clearInterval(int) 
            int = null
        }
        int = setInterval(() => ws.send(JSON.stringify({ op: 10 })), data.d.heartbeatInterval)
    }
})
ws.addEventListener("open", () => console.log("Connected!"))
ws.addEventListener("close", () => {
    console.log("Disconnected!")
    clearInterval(int)
})
*/