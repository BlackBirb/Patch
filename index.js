const Bot = require("./src/app.js")
const Web = require("./web/server/app.js")
const config = require("./config.json")

const client = new Bot(config, Web);

process.on("unhandledRejection", err => {
    console.log(`Unhandled rejection`, err)
});
process.on('SIGINT', () => {
    console.warn("Terminating Services...");
    client.terminate().then(() => {
        console.ok("Closing the app")
        process.exit(0)
    })
});