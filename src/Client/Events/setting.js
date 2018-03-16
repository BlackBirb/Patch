module.exports = async function(guild, settings) {
    if(settings.type === "update") {
        for(const key of Object.keys(settings.payload)) {
            guild.settings[key] = settings.payload[key]
        }
    } else if(settings.type === "default") {
        guild.settings = Object.assign({}, this.constants.defaults.guildSettings)
        await this.db.removeSettinngs(guild.id)
        this.db.createSettings(guild.id)
        return;
    }
    else if(settings.type === "delete") {
        guild.settings = {}
        this.db.removeSettings(guild.id)
        return;
    }
    
    this.db.updateSettings(guild.id, settings.payload)
}