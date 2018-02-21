module.exports = function(msg) {
    const { client } = msg;
    if(msg.author.bot) return;
    if(msg.channel.type === "text" && !msg.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return

    const cmd = msg.prepareCommand()
    if(!msg.isCommand) return;
    client.emit("command", cmd)
}