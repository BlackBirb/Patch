const path = require("path")

const pathGetter = (dir, folder) => file => path.resolve(dir || __dirname, folder || "", file || "")

const pickRandom = arr => arr[Math.floor(Math.random()*arr.length)]

const transformTag = (tag, msg) => tag
    .replace(/\$author#/g, msg.author.toString())
    .replace(/\$authornick#/g, msg.member ? msg.member.displayName : msg.author.nickname)
    .replace(/\$channel#/g, msg.channel.name)
    .replace(/\$params#/g, msg.params ? msg.params.join(" ") : "-")
    .replace(/\$param(\d)#/g, (match, id) => msg.params && msg.params[id-1] ? msg.params[id-1] : "-") 

// this all is so stupid and probably slow...

const formatSec = sec => 
    [ Math.floor(sec / 86400), Math.floor(sec / 3600) % 24, Math.floor(sec / 60) % 60, sec % 60 ]
        .map(v => v < 10 ? "0" + v : v)
		.filter((v,i) => v !== "00" || i > 1)
        .join(":")

const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const cloneArray = arr => Array.from(arr,item => Array.isArray(item) ? cloneArray(item) : item);

module.exports = {
    pathGetter,
    pickRandom,
    transformTag,
    formatSec,
    escapeRegex,
    cloneArray
}