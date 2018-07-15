module.exports = GuildChannel => 
class SyncedGuildChannel extends GuildChannel {
    get permissions() {
        return this.permissionsFor(this.guild.me)
    }

    get blacklisted() {
        return this.guild.settings.blacklistedChannels.includes(this.id) ||
        this.guild.settings.blacklistedCategories.includes(this.parentID)
    }

    async blacklist() {
        const bl = this.guild.settings.blacklistedChannels
        if(this.blacklisted)
            bl.splice(bl.indexOf(this.id), 1)
        else 
            bl.push(this.id)
        await this.guild.updateSettings({ blacklistedChannels: bl })
        return this.blacklisted
    }
}
