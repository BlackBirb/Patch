/* eslint-disable */
const { RichEmbed } = require("discord.js")
const Command = require("../Structures/Command.js")

module.exports = class Ping extends Command {
    constructor(client, id) {
        super(client, id)
        this.name = "ping" // default command name
            // this.aliases = [ ] // alias
            // this.premissions = 0b1 // define them later
        this.channels = ["text", "dm"] // why tho? This can work on all channels

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

    async run(msg) {
        const newMsg = await msg.channel.send(`Ping!`)
        const ping = {
            http: newMsg.createdTimestamp - msg.createdTimestamp,
            ws: Math.round(this.client.ping)
        }
        
        let color = this.calcColor(ping.http)
        if(ping.ws > ping.http) color = this.calcColor(ping.ws)

        const embed = new RichEmbed()
            .setColor(color)
            .setTitle(this.client.utils.pickRandom(this.messages))
            .addField("Http ping", ping.http, true)
            .addField("Websocket ping", ping.ws, true)

        newMsg.edit({ embed })
    }
}