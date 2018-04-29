const Command = require("../Structures/Command.js")
const { MessageEmbed, Collection } = require("discord.js")
module.exports = class List extends Command {
    constructor(client, id) {
        super(client, id)
        
        this.name = "list"
        this.help = {
            desc: "All the commands I know are right here!"
        }
        this.aliases = ["commands"]
    }

    run(msg) {
        const groups = new Collection()
        this.client.registry.groups.forEach(g => groups.set(g, []))
        this.client.registry.commands.forEach(c => groups.get(c.group).push(c))
        const embed = new MessageEmbed()
            .setColor(this.client.constants.STYLE.embed.color)
            .setAuthor("All of my commands", this.client.user.avatarURL())
            .setDescription(`There are ${this.client.registry.commands.size} commands total!\nFor more info about command use \`!help <command name>\`\nGroups:`)
            .setFooter("Powered by Patch")
        if(msg.channel.type === "text") 
            groups.forEach(g => g.filter(c => msg.member.hasCmdPermission(c.permissions)))
        else 
            groups.forEach(g => g.filter(c => msg.author.hasCmdPermission(c.permissions)))
        
        for(const [name, group] of groups.entries()) {
            if(group.length < 1) continue;
            let names = ""
            for(const command of group) {
                names += `${command.name}\n`
            }
            embed.addField(`> ${name}`, names, true)
        }
        msg.author.send(embed)
    }
}