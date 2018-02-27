module.exports = Discord => 
Object.defineProperties(Discord.Guild.prototype, {
    "voice": {
        value: {}, // new VoiceManager() ?
        writable: true
    },
    "_prefix": {
        value: undefined,
        writable: true
    },
    "tags": {
        value: []
    },
    "prefix": {
        get: function() {
            if(typeof this._prefix !== "string") {
                //get prefix somehow from settings
                this._prefix = "!"
            }
            return this._prefix

        },
        set: function(p) {
            //Set prefix to settings
            this._prefix = p
            return p
        }
    },
    "commandData": {
        value: {}
    },
    "createCmdData": { // i want it to be mutable
        value: function(command) {
            if(command.data)
                return this.commandData[command.name] = Object.assign({}, command.data)
            return {}
        }
    }
})