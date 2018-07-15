const { PERMISSIONS: { FULL_ADMIN } } = require("../Utils/Constants.js")
// Why doesn't GuildMember extends User? :C
module.exports = GuildMember => 
class SyncedGuildMember extends GuildMember {

    // Copy settings from user
    get settings() {
            return this.user.settings
    }
    set settings(v) {
        return this.user.settings = v
    }

    /**
     * Returns and sets guild specific permissions
     */
    get permissions() {
        if(!this.settings) 
            throw new Error("Tried to get guild permissions before they were loaded")
        if(this.settings.guildPermissions.hasOwnProperty(this.guild.id)) 
            return this.settings.guildPermissions[this.guild.id]
        return this.guild.settings.defaultPermissions
    }
    set permissions(perms) {
        if(!this.settings)
            throw new Error("Tried to set guild permissions before they were loaded")
        Object.assign(this.settings.guildPermissions, { [this.guild.id]: perms })
        this.client.db.setMemberPermissions(this.id, this.guild.id, perms)
    }

    // Copy paste
    editPermission(perms) {
        if(typeof perms !== 'number') return false
        const permissions = this.permissions
        return this.permissions = permissions ^ perms
    }

    // Copy paste - checks only for guild permissions
    hasCmdPermissionLocal(permission) {
        const permissions = this.permissions
        return (permissions & permission) === permission || permissions === FULL_ADMIN
    }

    // Checks for guild permissions or global
    hasCmdPermission(permission) {
        const permissions = this.permissions
        if((permissions & permission) === permission || permissions === FULL_ADMIN) return true
        const userPermissions = this.user.permissions
        return (userPermissions & permission) === permission || userPermissions === FULL_ADMIN
    }
}
