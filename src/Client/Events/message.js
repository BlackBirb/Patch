module.exports = function(msg) {
    if(msg.author.bot) return;
    if(msg.channel.type === "text" && !msg.channel.permissionsFor(this.user).has("SEND_MESSAGES")) return;

    this.performance = Date.now()

    const cmd = msg.prepareCommand()

    if(msg.type === "COMMAND") {
        // fuck async functions, way too slow even when load from cache
        const promises = [] // load all user data
        if(!msg.author.settings) promises.push(msg.author.loadSettings())
        if(!msg.author._account) promises.push(msg.author.loadAccount())
        if(promises.length > 0) {
            msg.channel.startTyping()
            return Promise.all(promises).then(() => {
                msg.channel.stopTyping(true)
                this.emit("command", cmd)
            })
        }
        return this.emit("command", cmd)
    }

    msg.checkIfResponse().then(response => {
        if(msg.type === "RESPONSE")
            return this.emit("response", response)
    })
}
