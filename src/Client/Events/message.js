module.exports = function(msg) {
    if(msg.author.bot) return;
    if(msg.channel.type === "text" && !msg.channel.permissionsFor(this.user).has("SEND_MESSAGES")) return

    const cmd = msg.prepareCommand()
    if(!msg.isCommand) return;
    this.emit("command", cmd)
}