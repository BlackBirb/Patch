const Discord = require("discord.js")
const { pathGetter } = require("./Utils/main.js")
const fs = require('fs')
require("./Utils/Logger.js");

const path = pathGetter(__dirname, "ExtendedStructures")
const extend = fs.readdirSync(path(""))
console.log(extend)

module.exports = function() {
    for(const name of extend) {
        const extender = require(path(name))
        Discord.Structures.extend(name.slice(0,-3), extender)
    }
    
    console.ok("Discord module extended with:", extend.join(", "))
    return Discord
}