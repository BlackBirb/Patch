const { Router, static } = require("express")
const path = require('path')
const app = Router()
app.use(static(path.resolve(__dirname, '../public/')))


module.exports = app