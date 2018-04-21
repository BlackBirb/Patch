const { RichEmbed } = require("discord.js");
const Command = require("../Structures/Command.js")

module.exports = class Help extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "help"
        this.help = {
            desc: "Tires to explain how given command works.",
            format: "<command>",
            examples: [
                "",
                "hug"
            ]
        }
        this.aliases = ["halp"]
        this.ignoreBlacklist = true
        this.channels = ["text", "dm"]

        this.types = {
            "command": {
                required: false,
            }
        }

        this.noCmdDesc = [
            "So you need help, ok...",
            "Ok sooo...",
            "Eh, again:"
        ]
        this.noCmdErr = [
            "Sorry.",
            "Too bad.",
            "Try again.",
            "I think..."
        ]
    }

    inhibitor(msg) {
        if(msg.channel.type === "text" && (!msg.guild.active() || msg.channel.blacklisted)) {
            msg.reply("I was told not to answer on this channel, so... bye.")
            return false
        }
    }

    async run(msg, params, { utils }) {
        const embed = new RichEmbed()
            .setColor(this.client.constants.STYLE.embed.color)
            .setFooter("With <3 ~Patch")
        if(!params.command) {
            embed.setTitle("Help")
                 .setDescription(`${utils.pickRandom(this.noCmdDesc)} If you don't know what a command do, you can call help on it, just **add it's name after ${msg.guild.prefix}help** and I'll try my best to explain it to you.\nIf You don't know what commands there are use **${msg.guild.prefix}list** to see them all.`)
        } else {
            const cmd = this.client.registry.find(params.command)
            if(cmd) {
                let command = msg.guild.prefix+params.command
                embed.setTitle("Command "+command)
                     .setFooter("Things in <> are optional. Ones in [] are required")
                     .setDescription(cmd.help.desc)
                if(cmd.help.format)
                    embed.addField("**> Format**", 
                        cmd.help.format.split(" / ").map(format => "`"+command+" "+format+"`").join(" or\n") //oh boi, i don't like doing that...
                    )
                else 
                    embed.addField("**> Format**", "This command doesn't have any parameters")
                if(cmd.help.examples) 
                     embed.addField("**> Examples**", cmd.help.examples.map(e => `\`${command} ${e}\``).join("\n"))
            }
            else 
                embed.setColor(this.client.constants.STYLE.embed.colorFail)
                    .setTitle(`Command ${params.command} not found`)
                    .setDescription(`It seems like there's no such command. ${utils.pickRandom(this.noCmdErr)}`)
        }
        msg.channel.send(embed)
    }
}