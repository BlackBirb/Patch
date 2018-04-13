module.exports = function(msg) {
    if(msg.channel.type === "text" && (!msg.guild.settings.responses || !msg.guild.active() || msg.channel.blacklisted)) return
    if(msg.guild.cooldowns("response")) return;
    msg.guild.setCooldown("response")
    const response = this.utils.pickRandom(msg.responses)
    return msg.channel.send(response)
}