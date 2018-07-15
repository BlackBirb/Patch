const { defaults: { guildSettings } } = require("../Utils/Constants.js")

module.exports = Guild => 
class SyncedGuild extends Guild {
    constructor(c, d) {
        super(c, d)
        this.voice;
        this.settings;
        this.commandData = {}
        this._cooldowns;
    }

    prepareGuild() {
        this.voice = new (this.client.VoiceManager)(this)
        this._cooldowns = new Map()
        this.loadSettings()
    }

    /**
     * Loads settings to guild object.
     * No need to do it more than once, all settings change should also affect <Guild>.settings
     */
    async loadSettings() {
        let settings = await this.client.db.getSettings(this.id, "guild")
        if(!settings) {
            settings = guildSettings
            this.client.db.collection("guildSettings").insertOne({ id: this.id })
        }
        return this.settings = Object.assign({}, guildSettings, settings)
    }

    /**
     * Updates one setting in guild
     * 
     * @param {Object} settings settings to change.
     * @returns {void}
     */
    updateSettings(settings) {
            for(const key of Object.keys(settings)) {
                this.settings[key] = settings[key]
            }
            return this.client.db.collection("guildSettings").updateOne({ id: this.id }, { $set: settings })
    }
    
    /**
     * Restores default settings
     */
    async clearSettings() {
        this.settings = Object.assign({}, guildSettings)
        await this.client.db.collection("guildSettings").removeOne({ id: this.id })
        return this.clinet.db.collection("guildSettings").insertOne({ id: this.id })
    }

    /**
     * Returns a tag if exists else null
     */
    tag(name) {
        return this.settings.tags.hasOwnProperty(name) ? this.settings.tags[name] : null;
    }
    get tags() {
        return this.settings.tags || null
    }

    /**
     * Adds a tag(s) to guilds settings
     * @param {Object} tag can have multiple tags
     * eg. {
     *  "tag1": "response",
     *  "moreTags": "Hello!"
     * }
     * @returns {Object} tags
     */
    addTag(tag) {
        const tags = Object.assign(this.settings.tags, tag)
        this.updateSettings({ tags })
        return tags
    }

    /**
     * Returns a prefix, or sets it
     */
    get prefix() {
        return this.settings.prefix
    }
    set prefix(prefix) {
        // eslint-disable-next-line no-useless-escape
        prefix = this.client.utils.escapeRegex(prefix)
        this.updateSettings({ prefix })
        return prefix
    }

    /**
     * Tells if guild is active, if setting is given changes (de)activates guild
     * @param {Boolean} active Optional
     * @returns {Boolean}
     */
    active(setting) {
        if(setting === undefined) 
            return this.settings.active
        else if(setting === true && !this.settings.active)
            return this.updateSettings({ active: true }).then(() => this.settings.active)
        else if(setting === false && this.settings.active)
            return this.updateSettings({ active: false }).then(() => this.settings.active)
    }
    createCmdData(command) {
        if(typeof command.initialData === "function")
            return this.commandData[command.id] = Object.assign({}, command.initialData())
        return {}
    }

    /**
     * Rn for responses only
     * 
     * returns Boolean meaning if it's on cooldown (true) or not (false)
     */
    cooldowns(on) {
        if(this._cooldowns.has(on) && this.settings.cooldowns.hasOwnProperty(on)) {
            return this._cooldowns.get(on) + this.settings.cooldowns[on]*1000 > Date.now()
        }
        return false
    }

    setCooldown(on) {
        const timestamp = Date.now()
        this._cooldowns.set(on, timestamp)
        return timestamp
    }
}
