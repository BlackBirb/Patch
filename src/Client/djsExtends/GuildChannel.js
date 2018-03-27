module.exports = Discord => 
Object.defineProperties(Discord.GuildChannel.prototype, {
    permissions: {
        get: function() {
            return this.permissionsFor(this.guild.me)
        }
    }
})