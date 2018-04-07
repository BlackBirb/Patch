const MessageEmbed = require("discord.js").RichEmbed
const constants = require("../../Client/Utils/Constants.js")
const Command = require("../../Structures/Command.js")

module.exports = class Account extends Command {
    constructor(c, i) {
        super(c, i)
        this.name = "account"
        this.aliases = ["me"]

        this.descriptions = [
            "Nice.", 
            "Eeee... Here!",
            "Wow you're poor",
            "This is all your important stuff? Pfft~ /)c<",
            "Here you go:",
            "Meh, I've seen better",
            "Wait, my cat is eating your records... Staaap!~ OK here you go.",
            "Got it!",
            "Not bad...",
            "It... worked?",
            "Gotcha!",
            "Waaait.. Let me find your accout..."
        ]
    }
    async run(msg) {
        const account = await msg.author.account
        const embed = new MessageEmbed()
            .setTitle(`${msg.member ? msg.member.displayName : msg.author.username}'s account.`)
            .setThumbnail(msg.author.avatarURL)
            .setDescription(this.client.utils.pickRandom(this.descriptions))
            .setColor(constants.STYLE.richEmbed.color)
            .addField("Moneyz", account.currency + " 🍪", true)
            .addField("Custom tags?", `${Object.keys(account.tags).length || "Nope."}`, true)
            .setFooter("Powered by Patch")
        msg.channel.send(embed)
    }
}