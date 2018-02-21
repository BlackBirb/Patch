const path = require("path")

const pathGetter = (dir, folder) => file => path.resolve(dir || __dirname, folder || "", file || "")

const pickRandom = arr => arr[Math.floor(Math.random()*arr.length)]

module.exports = {
    pathGetter,
    pickRandom
}