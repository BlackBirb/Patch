const Bot = require("./src/app.js")
const Web = require("./web/server/app.js")
const config = require("./config.json")

const client = new Bot(config, Web);


process.on('SIGINT', () => {
    console.warn("Terminating Services...");
    client.terminate().then(() => {
        console.ok("Closing the app")
        process.exit(0)
    })
    .catch(err => {
        console.error(err)
        process.exit(0)
    })
});
process.on("unhandledRejection", err => {
    console.log(`Unhandled rejection`, err.stack)
});
if(config.run.memwatch) {
    const memwatch = require("memwatch")
    memwatch.on("leak", info => {
        console.warn("Memory leak detected")
        console.dir(info)
    })
    memwatch.on("stats", stats => {
        console.info("MemWatch stats:")
        console.log(stats)
    })
}
