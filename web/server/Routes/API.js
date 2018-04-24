const { Router } = require("express")
const app = Router()

const checkAuth = require("../Utils/Auth.js")

app.get("/auth", (req, res) => {
    if(req.isAuthenticated()) 
        return res.status(200).json({ "authenticated": true })        
    return res.status(401).json({ "authenticated": false })
})

app.get("/but", checkAuth, (req, res) => {
    res.json({"It": "Did worked"})
})

app.use("/*", (req, res) => {
    res.status(404).json({ "error": "Route not found" })
})


module.exports = app