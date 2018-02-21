module.exports = function(msg) {
    const { client } = msg
    const cmd = client.registry.find(msg.name)

    cmd.process(msg)
    // check permissions
    // prepare args
    // run command
}