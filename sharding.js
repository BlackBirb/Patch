const { ShardingManager } = require("discord.js")
const manager = new ShardingManager("./index.js")
manager.spawn(1)