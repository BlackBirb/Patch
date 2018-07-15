/* eslint-disable */
const { MessageEmbed } = require("discord.js")
const Command = require("../Structures/Command.js")

module.exports = class Ping extends Command {
    constructor(client, id) {
        super(client, id)

        this.name = "ping"
        this.help = {
            desc: "Check how laggy i'm"
        }
        this.aliases = ["pong"]
        this.channels = ["text", "dm"]

        this.messages = [
            "That's not so bad.",
            "EEeee, it's ok.",
            "This is fine",
            "Oh my",
            "Beep?",
            "Meh",
            "Could be better",
            "Damn I'm fast",
            "Woosh",
            "Pong!"
        ]
    }

    calcColor(ping) {
        let green = 255;
        let red = 0;
        while(red < 255) {
            ping -= 32
            if(ping <= 0) break;
            red += 16;
            if(red > 255) red = 255
        }
        while(green > 0) {
            ping -= 32
            if(ping <= 0) break;
            green -= 16;
            if(green < 0) green = 0   
            ping -= 32
        }
        return [red, green, 0]
    }

    async run(msg, p, { utils }) {

        msg.channel.send(msg.mentions.users.size > 0 ? msg.mentions.users.first().toString() : "None")

        return;
        const newMsg = await msg.channel.send(`Ping!`)
        const ping = {
            http: newMsg.createdTimestamp - msg.createdTimestamp,
            ws: Math.round(this.client.ping)
        }
        
        let color = this.calcColor(ping.http)
        if(ping.ws > ping.http) color = this.calcColor(ping.ws)

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(utils.pickRandom(this.messages))
            .addField("Http ping", ping.http, true)
            .addField("Websocket ping", ping.ws, true)

        newMsg.edit({ embed })
    }
}