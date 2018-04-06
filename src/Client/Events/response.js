module.exports = function(msg) {
    if(msg.channel.type === "text" && !msg.guild.settings.responses) return
    const response = this.utils.pickRandom(msg.responses)
    return msg.channel.send(response)
}