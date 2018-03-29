const { defaults: { userSettings }, PERMISSIONS: { FULL_ADMIN } } = require("../Utils/Constants.js")

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
            if(!this.settings.permissions) await this.updateSettings()
            this.client.db.setUserPermissions(this.id, Object.assign(this.settings.permissions, perms))
        }
    },
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
    editPermission: {
        value: async function(perms = 0x1, guild = "GLOBAL") {
            let permissions = await this.getPermissions(guild)
            
            permissions = permissions ^ perms

            this.permissions = permissions
            return permissions
        }
    },
    hasPermissionIn: {
        value: async function(permission, guild = "GLOBAL") {
            let permissions = await this.getPermissions(guild)
            return (permissions & permission) === permission || permissions === FULL_ADMIN
        }
    },
    hasPermission: { // works like hasPermissionIn but also checks GLOBAL if failed in guild.
        value: async function(permission, guild) {
            return await this.permissions.then(all => {
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
    }
})