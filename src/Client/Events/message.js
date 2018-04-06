module.exports = async function(msg) {
    if(msg.author.bot) return;
    if(msg.channel.type === "text" && !msg.channel.permissionsFor(this.user).has("SEND_MESSAGES")) return;

    const cmd = msg.prepareCommand()
    if(msg.type === "COMMAND") 
        return this.emit("command", cmd)

    const response = await msg.checkIfResponse()
    if(msg.type === "RESPONSE")
        return this.emit("response", response)
}
