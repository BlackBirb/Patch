const randEnds = ["Rawr", "Squeak", "Mrawr", "Purrs"]
const end = () => randEnds[Math.floor(Math.random()*randEnds.length)]

module.exports = function(guild) {
    console.info(`Joined a ${guild.name}#${guild.id} Guild!`)
    guild.prepareGuild()
    guild.members.fetch(guild.ownerID).then(owner => {
        owner.user.send({ embed: {
            color: 0x75E9FF,
            title: "Hi! I'm patch!",
            description: `You or someone from your server invited me to your guild.\nI can do a lot of things, check !list for all commands and go to [my page](${this.constants.webURL}) for tons of cool features!`,
            footer: {
                text: `Created by ${this.constants.author}, ${end()} ~ <3`
            }
        }})
        console.info("Message send to guild owner", owner.user.tag)
    })

    console.ok("Guild ready.")
}