module.exports = Discord => 
Object.defineProperties(Discord.GuildChannel.prototype, {
    permissions: {
        get: function() {
            return this.permissionsFor(this.guild.me)
        }
    },
    blacklisted: {
        get: function() {
            return this.guild.settings.blacklistedChannels.includes(this.id)
        }
    },
    blacklist: {
        value: async function() {
            const bl = this.guild.settings.blacklistedChannels
            if(this.blacklisted)
                bl.splice(bl.indexOf(this.id), 1)
            else 
                bl.push(this.id)
            await this.guild.updateSettings({ blacklistedChannels: bl })
            return this.blacklisted
        }
    }
})