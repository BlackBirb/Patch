const Discord = require("discord.js")
const { pathGetter } = require("./Utils/main.js")

const extend = [
    "Message",
    "Guild"
]
const path = pathGetter(__dirname, "djsExtends")
for(const name of extend) {
    require(path(name)+".js")(Discord)
}

module.exports = Discord