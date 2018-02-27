const Discord = require("discord.js")
const { pathGetter } = require("./Utils/main.js")
const logger = require("./Utils/Logger.js")

const extend = [
    "Message",
    "Guild"
]
const path = pathGetter(__dirname, "djsExtends")
for(const name of extend) {
    require(path(name)+".js")(Discord)
}

logger.ok("Discord module extended with:", extend.join(", "))
module.exports = Discord