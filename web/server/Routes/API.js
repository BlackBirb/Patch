const { Router } = require("express")
const checkAuth = require("../Utils/Auth.js")

module.exports = client => {
    const app = Router()
    
    app.get("/auth", (req, res) => {
        if(req.isAuthenticated()) {
            const responseData = {
                authenticated: true, 
                user: {
                    username: req.user.username,
                    discriminator: req.user.discriminator,
                    id: req.user.id,
                    avatar: req.user.avatar,
                    guilds: req.user.guilds.map(guild => ({
                            canInvite: guild.owner || [8, 32, 40].includes(40 & guild.permissions),
                            common: client.guilds.has(guild.id),
                            permissions: guild.permissions || null,
                            icon: guild.icon || null,
                            iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : null,
                            id: guild.id || null,
                            name: guild.name || null
                        })
                    ).filter(g => g.common || g.canInvite)
                }
            }
            // i don't like async/await ok? It's slow...
            return client.users.fetch(req.user.id)
                .then(user => {
                    if(user) {
                        const promises = []
                        if(!user.settings || !user._account) {
                            promises.push(user.loadSettings())
                            promises.push(user.loadAccount())
                        }
                        if(promises.length > 0)
                            return Promise.all(promises).then(() => user)
                        else return user
                    }
                    return null
                })
                .then(user => {
                    if(user) {
                        responseData.account = user.account
                        responseData.settings = user.settings
                    }
                    return responseData
                })
                .then(data => res.status(200).json(data))
                .catch(console.error)
        }
        return res.status(401).json({ "authenticated": false })
    })
    
    app.get("/but", checkAuth, (req, res) => {
        res.json({"It": "Did worked"})
    })
    
    app.use("/*", (req, res) => {
        res.status(404).json({ "error": "Route not found" })
    })
    return app
}