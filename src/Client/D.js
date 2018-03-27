const Discord = require("discord.js")
const { pathGetter } = require("./Utils/main.js")
require("./Utils/Logger.js");
const extend = [
    "Message",
    "Guild",
    "GuildChannel",
    "User"
]
const path = pathGetter(__dirname, "djsExtends")
for(const name of extend) {
    require(path(name)+".js")(Discord)
}

console.ok("Discord module extended with:", extend.join(", "))
module.exports = Discord