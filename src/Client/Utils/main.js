const path = require("path")

const pathGetter = (dir, folder) => file => path.resolve(dir || __dirname, folder || "", file || "")

const pickRandom = arr => arr[Math.floor(Math.random()*arr.length)]

const transformTag = (tag, msg) => tag
    .replace(/\$author#/g, msg.author.toString())
    .replace(/\$authornick#/g, msg.member ? msg.member.displayName : msg.author.nickname)
    .replace(/\$channel#/g, msg.channel.name)
    .replace(/\$params#/g, msg.params ? msg.params.join(" ") : "-")
    .replace(/\$param(\d)#/g, msg.params ? msg.params[/\$param(\d)/g.exec(tag)[1]-1] : "-") 

// this all is so stupid and probably slow...

module.exports = {
    pathGetter,
    pickRandom,
    transformTag
}