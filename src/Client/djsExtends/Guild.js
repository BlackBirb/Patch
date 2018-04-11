const { defaults: { guildSettings } } = require("../Utils/Constants.js")

module.exports = Discord => 
Object.defineProperties(Discord.Guild.prototype, {
    "voice": {
        value: undefined,
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
            for(const key of Object.keys(settings)) {
                this.settings[key] = settings[key]
            }
            return this.client.db.updateSettings(this.id, settings)
        } 
    },
    /**
     * Restores default settings
     */
    "clearSettings": {
        value: async function() {
            this.settings = Object.assign({}, guildSettings)
            await this.client.db.removeSettinngs(this.id)
            return this.clinet.db.createSettings(this.id)
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
                settings = guildSettings
                this.client.db.createSettings(this.id, settings)
            }
            return this.settings = Object.assign({}, guildSettings, settings) // in case there's new setting that this guild doesn't have
            // and it's ok if it won't be saved with new ones, that would be even better... :thonk:
        }
    },
    "tag": {
        value: function(name, msg) {
            let tag = this.settings.tags.hasOwnProperty(name) ? this.settings.tags[name] : null;
            if(tag === null) return tag
            return this.client.utils.transformTag(tag, msg)
        }
    },
    "tags": {
        get: function() {
            return this.settings.tags
        },
        set: function(tag) {
            const tags = Object.assign(this.settings.tags, tag)
            this.updateSettings({ tags })
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
    "active": {
        value: function(setting) {
            if(setting === undefined) 
                return this.settings.active
            else if(setting === true && !this.settings.active)
                return this.updateSettings({ active: true }).then(() => this.settings.active)
            else if(setting === false && this.settings.active)
                return this.updateSettings({ active: false }).then(() => this.settings.active)
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