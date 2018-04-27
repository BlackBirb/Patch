const fs = require('fs');
const path = require('path')
const https = require("https")

const express = require("express")
const { static } = express
const passport = require("passport");
const session = require("express-session");
const LevelStore = require("level-session-store")(session);
const Strategy = require("passport-discord").Strategy;
const bodyParser = require("body-parser");
const helmet = require("helmet");

const APIRoutes = require("./Routes/API.js")
const { port, useSSL } = require("./constants.json")


const configureExpress = (client, app) => {
    app.enable('trust proxy');
    app.disable('x-powered-by'); // why not?
    app.use(function (req, res, next) {
        res.set({
            "powered-by": "Patch"
        })
        if (req.secure) {
            return next();
        }
        res.redirect("https://" + req.headers.host + req.url);
    });

    passport.serializeUser((user, done) => {
        done(null, user);
    })
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    })

    app.use("/", static(path.resolve(__dirname, '../public/')))
    passport.use(new Strategy({
        clientID: client.config.web.appID,
        clientSecret: client.config.web.oauthSecret,
        callbackURL: client.config.web.callbackURL,
        scope: ["identify", "guilds"]
    },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        }));

    app.use(session({
        store: new LevelStore("./web/data/"),
        secret: client.config.web.sessionSecret,
        resave: false,
        saveUninitialized: false,
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(helmet());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.get("/api/login", (req, res, next) => {
        if(!req.isAuthenticated()) return next();
        else res.redirect("/")
    }, passport.authenticate("discord"))

    app.get("/api/callback", 
        passport.authenticate("discord", { failureRedirect: "/autherror" }), 
        (req, res) => res.redirect("/login")
    )

    app.get("/api/logout", (req, res, next) => {
        if(req.isAuthenticated()) return next();
        else res.redirect("/")
    },function (req, res) {
        req.session.destroy(() => {
            req.logout()
            res.redirect("/logout")
        })
    })
    app.use("/api", APIRoutes)

    app.use("*", static(path.resolve(__dirname, '../public/')))
}

module.exports = class WebInterface {
    constructor(client) {
        const options = {}
        if (useSSL) {
            const sslPath = path.resolve(__dirname, '../ssl/')
            options.cert = fs.readFileSync(sslPath + '/localhost.crt'),
                options.key = fs.readFileSync(sslPath + '/localhost.key')
            const http = require("http")
            http.createServer((req, res) => {
                res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url })
                res.end();
            }).listen(80);
        }

        const expressApp = express()
        this.server = useSSL
            ? https.createServer(options, expressApp)
            : expressApp
        configureExpress(client, expressApp)
    }

    init() {
        return new Promise(resolve => {
            this.server.listen(port, () => {
                console.ok("Server is listening on port", port)
                resolve(true)
            })
        })
    }

    async terminate() {
        return new Promise(resolve => {
            resolve(true)
        })
    }
}
