module.exports = {
    msgAutodelete(msg) {
        if(msg.channel.permissions.has("MANAGE_MESSAGES"))
            msg.delete()
    }
}