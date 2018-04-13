const { defaults: { userSettings, userAccount }, PERMISSIONS: { FULL_ADMIN } } = require("../Utils/Constants.js")

module.exports = Discord => 
Object.defineProperties(Discord.User.prototype, {
    settings: {
        value: {},
        writable: true
    },

    /**
     * Loads settings to cache
     */
    loadSettings: {
        value: async function() {
            let settings = await this.client.db.getSettings(this.id, "user")
            if(!settings) {
                settings = userSettings
                this.client.db.collection("userSettings").insertOne({ id: this.id })
            }
            return this.settings = Object.assign({}, userSettings, settings)
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
     * Returns or sets permissions for all guilds and global.
     */
    permissions: {
        get: async function() {
            if(this.settings.permissions) return this.settings.permissions
            await this.loadSettings()
            return this.settings.permissions
        },
        set: async function(perms) {
            if(!this.settings.permissions) await this.loadSettings()
            this.client.db.setUserPermissions(this.id, Object.assign(this.settings.permissions, perms))
        }
    },
    /**
     * Is a function that returns permissions in specific guild / global
     */
    getPermissions: {
        value: async function(on = "GLOBAL") {
            return this.permissions.then(all => {
                let permissions = all[on]
                if(!permissions && this.client.guilds.has(on)) // i will never be when guild === "GLOBAL" don't worry me
                    permissions = this.client.guilds.get(on).settings.defaultPermissions
                return permissions
            })
        }
    },
    /**
     * Edits permissions for guild or globally
     * @param {Number} perms bitfield permissions to run through exor
     * @param {String} guild build to change permissions on, default is global
     */
    editPermission: {
        value: async function(perms, guild = "GLOBAL") {
            if(perms === undefined) return false
            const permissions = await this.getPermissions(guild)
            return this.permissions = permissions ^ perms
        }
    },
    /**
     * Checks if user have permission in specified channel
     * @returns {Promise<Boolean>}
     */
    hasPermissionIn: {
        value: async function(permission, guild = "GLOBAL") {
            let permissions = await this.getPermissions(guild)
            return (permissions & permission) === permission || permissions === FULL_ADMIN
        }
    },
    /**
     * Works like hasPermissionIn but also checks GLOBAL if failed in guild.
     */
    hasPermission: {
        value: async function(permission, guild) {
            return this.permissions.then(all => {
                let res = false
                if(guild && guild !== "GLOBAL") {
                    let guildPerms = all[guild]
                    if(!guildPerms && this.client.guilds.has(guild)) // copypaste
                        guildPerms = this.client.guilds.get(guild).settings.defaultPermissions
                    res = (guildPerms & permission) === permission || guildPerms === FULL_ADMIN
                }
                if(!res) {
                    let globalPerms = all["GLOBAL"]
                    res = (globalPerms & permission) === permission || globalPerms === FULL_ADMIN
                }
                return res
            })
        }
    },

    /**
     * Returns account from cache or database
     * Setes only local cache
     * 
     * ~~Returns promise if not cached and doesn't if cached... nvm, bad idea~~
     */
    account: {
        get: async function() {
            if(this._account) return this._account
            this._account = Object.assign({}, userAccount, await this.client.db.getUserAccount(this.id))
            return this._account
        },
        set: function(things) {
            this._account = things
        }
    },
    /**
     * Updates account with specified data
     */
    updateAccount: {
        value: async function(data) {
            await this.client.db.collection("userAccounts").updateOne({ id: this.id }, { $set: data })
            return Object.assign(this._account, data)
        }
    }
})