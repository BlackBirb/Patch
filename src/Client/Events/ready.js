const getStatus = require("../Utils/playingStatus.js")
module.exports = function(evn) {
    if(typeof evn === "string") {
        return console.loaded("Fake test loaded!")
    }
    
    console.loading("Getting guilds settings...")
    this.guilds.forEach(g => g.loadSettings())
    console.ok("Guilds settings loaded")

    this.user.setActivity(...getStatus(this))
    setInterval(() => this.user.setActivity(...getStatus(this)), this.constants.statusChangeDelay)
    console.log("All systems ready?")
}