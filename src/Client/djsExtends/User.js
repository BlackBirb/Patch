const { defaults: { userSettings } } = require("../Utils/Constants.js")

module.exports = Discord => 
Object.defineProperties(Discord.User.prototype, {
    settings: {
        value: {},
        writable: true
    },

    updateSettings: {
        value: async function() {
            let settings = await this.client.db.getUserSettings(this.id)
            if(!settings) {
                settings = userSettings
                this.client.db.createUserSettings(this.id)
            }
            return this.settings = Object.assign({}, userSettings, settings)
        }
    },
    permissions: {
        get: async function() {
            if(this.settings.permissions) return this.settings.permissions
            await this.updateSettings()
            return this.settings.permissions
        },
        set: async function(perms) {
            if(isNaN(perms)) return Promise.reject("Not a number")
            this.client.db.setUserPermissions(this.id, perms)
            this.settings.permissions = perms
        }
    }
})