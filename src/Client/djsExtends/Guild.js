module.exports = Discord => 
Object.defineProperties(Discord.Guild.prototype, {
    "voice": {
        value: {}, // new VoiceManager() ?
        writable: true
    },
    "settings": {
        value: undefined,
        writable: true
    },
    /**
     * Updates one setting in guild
     * 
     * @param {Object} settings settings to change.
     * @returns {void}
     */
    "updateSettings": {
        value: function(settings) {
            this.client.emit("setting", this, {
                type: "update",
                payload: settings
            })
        } 
    },
    /**
     * Restores default settings
     */
    "clearSettings": {
        value: function() {
            this.client.emit("setting", this, { type: "default" })
        }
    },
    /**
     * Loads settings to guild object.
     * No need to do it more than once, all settings change should also affect <Guild>.settings
     */
    "loadSettings": {
        value: async function() {
            let settings = await this.client.db.getSettings(this.id)
            if(!settings) {
                settings = this.client.constants.defaults.guildSettings
                this.client.db.createSettings(this.id, settings)
            }
            return this.settings = Object.assign({}, this.client.constants.defaults.guildSettings, settings) // in case there's new setting that this guild doesn't have
            // and it's ok if it won't be saved with new ones, that would be even better... :thonk:
        }
    },
    "tags": {
        get: function() {
            return this.settings.tags
        },
        set: function(tag) {
            const tags = this.settings.tags.slice()
            tags.push(tag)
            this.updateSettings(tags)
            return tags
        }
    },
    "prefix": {
        get: function() {
            return this.settings.prefix
        },
        set: function(prefix) {
            this.updateSettings({ prefix })
            return prefix
        }
    },
    "commandData": {
        value: {},
        writable: true
    },
    "createCmdData": { // i want it to be mutable
        value: function(command) {
            if(typeof command.data === "function")
                return this.commandData[command.id] = Object.assign({}, command.data())
            return {}
        }
    }
})