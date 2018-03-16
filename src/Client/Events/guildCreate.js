module.exports = function(guild) {
    console.info(`Join a ${guild.name}#${guild.id} Guild!`)
    guild.loadSettings()

    console.ok("Guild ready.")
}