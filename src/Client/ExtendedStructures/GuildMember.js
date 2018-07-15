const { PERMISSIONS: { FULL_ADMIN } } = require("../Utils/Constants.js")
// Why doesn't GuildMember extends User? :C
module.exports = Discord => 
Object.defineProperties(Discord.GuildMember.prototype, {

    // Copy settings from user
    settings: {
        get: function() {
            return this.user.settings
        },
        set: function(v) {
            return this.user.settings = v
        }
    },
    /**
     * Returns and sets guild specific permissions
     */
    permissions: {
        get: function() {
            if(!this.settings) 
                throw new Error("Tried to get guild permissions before they were loaded")
            if(this.settings.guildPermissions.hasOwnProperty(this.guild.id)) 
                return this.settings.guildPermissions[this.guild.id]
            return this.guild.settings.defaultPermissions
        },
        set: function(perms) {
            if(!this.settings)
                throw new Error("Tried to set guild permissions before they were loaded")
            Object.assign(this.settings.guildPermissions, { [this.guild.id]: perms })
            this.client.db.setMemberPermissions(this.id, this.guild.id, perms)
        }
    },

    // Copy paste
    editPermission: {
        value: function(perms) {
            if(typeof perms !== 'number') return false
            const permissions = this.permissions
            return this.permissions = permissions ^ perms
        }
    },

    // Copy paste - checks only for guild permissions
    hasCmdPermissionLocal: {
        value: function(permission) {
            const permissions = this.permissions
            return (permissions & permission) === permission || permissions === FULL_ADMIN
        }
    },

    // Checks for guild permissions or global
    hasCmdPermission: {
        value: function(permission) {
            const permissions = this.permissions
            if((permissions & permission) === permission || permissions === FULL_ADMIN) return true
            const userPermissions = this.user.permissions
            return (userPermissions & permission) === permission || userPermissions === FULL_ADMIN
        }
    },
})
