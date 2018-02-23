const Bot = require("./src/app.js")
const config = require("./config.json")

const client = new Bot(config);

process.on("unhandledRejection", err => {
    console.log(`Unhandled rejection`, err)
});
  