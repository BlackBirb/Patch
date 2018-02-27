module.exports = function(evn) {
    if(typeof evn === "string") {
        return this.logger.loaded("Fake test loaded!")
    }
    else this.logger.loaded("Logged to discord!")
    
    this.user.setActivity("Meow?")
}