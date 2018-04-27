const { defaults: { userSettings, userAccount }, PERMISSIONS: { FULL_ADMIN } } = require("../Utils/Constants.js")

module.exports = Discord => 
Object.defineProperties(Discord.User.prototype, {
    /**
     * Loads settings to cache
     */
    loadSettings: {
        value: function() {
            return this.client.db.getSettings(this.id, "user").then(settings => {
                if(!settings) {
                    settings = userSettings
                    this.client.db.collection("userSettings").insertOne({ id: this.id })
                }
                return this.settings = Object.assign({}, userSettings, settings)
            })
        }
    },

    loadAccount: {
        value: function() {
            return this.client.db.getUserAccount(this.id).then(acc => {
                this._account = Object.assign({}, userAccount, acc)
            })
        }
    },
    /**
     * Updates settings with given object
     */
    updateSettings: {
        value: async function(settings) {
            for(const key of Object.keys(settings)) {
                this.settings[key] = settings[key]
            }
            return this.client.db.collection("userSettings").updateOne({ id: this.id }, { $set: settings })
        } 
    },

    /**
     * Returns or sets global permissions.
     */
    permissions: {
        get: function() {
            if(!this.settings) 
                throw new Error("Tried to get permissions before they were loaded")
            return this.settings.permissions
        },
        set: function(perms) {
            if(!this.settings) 
                throw new Error("Tried to edit permissions before they were loaded")
            this.settings.permissions = perms
            this.client.db.setUserPermissions(this.id, perms)
        }
    },
    /**
     * Edits global permissions
     * @param {Number} perms bitfield permissions to run through exor
     */
    editPermission: {
        value: function(perms) {
            if(perms === undefined) return false
            const permissions = this.permissions
            return this.permissions = permissions ^ perms
        }
    },
    /**
     * Checks if user have permissions in global
     * @returns {Promise<Boolean>}
     */
    hasCmdPermission: {
        value: function(permission) {
            let permissions = this.permissions
            return (permissions & permission) === permission || permissions === FULL_ADMIN
        }
    },

    /**
     * Returns account from cache or database
     * Setes only local cache
     * 
     * ~~Returns promise if not cached and doesn't if cached... nvm, bad idea~~
     */
    account: {
        get: function() {
            if(!this._account) 
                throw new Error("Tried to get account before it was loaded")
            return this._account
        },
        set: function(things) {
            this.updateAccount(things)
        }
    },
    /**
     * Updates account with specified data
     */
    updateAccount: {
        value: function(data) {
            this.client.db.collection("userAccounts").updateOne({ id: this.id }, { $set: data })
            return Object.assign(this._account, data)
        }
    }
})