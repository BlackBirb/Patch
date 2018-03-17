module.exports = function(guild) {
    console.info(`Joined a ${guild.name}#${guild.id} Guild!`)
    guild.loadSettings()
    guild.owner.send({ embed: {
        color: 0x75E9FF,
        title: "Hi! I'm patch!",
        description: `You or someone from your server invited me to your guild.\nI can do a lot of things, check !list for all commands and go to [my page](${this.constants.webURL}) for tons of cool features!`
    }})

    console.ok("Guild ready.")
}