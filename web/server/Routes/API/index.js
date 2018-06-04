const { Router } = require("express")
const checkAuth = require("../../Utils/Auth.js")

module.exports = client => {
    const app = Router()

    app.get("/auth", (req, res) => {
        if (req.isAuthenticated()) {
            return res.status(200).json({
                authenticated: true,
                user: {
                    username: req.user.username,
                    discriminator: req.user.discriminator,
                    id: req.user.id,
                    avatar: req.user.avatar
                }
            })
        }
        return res.status(401).json({ "authenticated": false })
    })

    app.get("/guilds", checkAuth, (req, res) => {
        res.status(200).json(
            req.user.guilds.map(guild => ({
                canInvite: guild.owner || [8, 32, 40].includes(40 & guild.permissions),
                common: client.guilds.has(guild.id),
                permissions: guild.permissions || null,
                icon: guild.icon || null,
                iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : null,
                id: guild.id || null,
                name: guild.name || null
            })
            ).filter(g => g.common || g.canInvite)
        )
    })

    app.get("/account", checkAuth, (req, res) => {
        client.users.fetch(req.user.id)
            .then(user => {
                if (user) {
                    const promises = []
                    if (!user.settings || !user._account) {
                        promises.push(user.loadSettings())
                        promises.push(user.loadAccount())
                    }
                    if (promises.length > 0)
                        return Promise.all(promises).then(() => user)
                    else return user
                }
                return null
            })
            .then(user => {
                if (user) {
                    for (let key of ["_id", "id"]) {
                        delete user.account[key]
                        delete user.settings[key]
                    }
                    return {
                        account: user.account,
                        settings: user.settings
                    }
                }
                else
                    return {
                        account: null,
                        settings: null
                    }
            })
            .then(data => res.status(200).json(data))
            .catch(console.error)
    })

    app.get("/")

    app.get("/but", checkAuth, (req, res) => {
        res.json({ "It": "Did worked" })
    })

    app.use("/*", (req, res) => {
        res.status(404).json({ "error": "Route not found" })
    })
    return app
}