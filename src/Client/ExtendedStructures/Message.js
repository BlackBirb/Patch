module.exports = Discord => 
Object.defineProperties(Discord.Message.prototype, {
    "params": {
        value: null,
        writable: true,
        configurable: true
    },
    "prepareCommand": {
        value: function() {
            const reg = {
                prefix: new RegExp(`^${this.prefix}(\\w+)(?: (.+))?`,"gis"),
                mention: /^<@!?\d{18}> ?(\w+)(?: (.+))?/gis,
                nickname: /^patch, ?(\w+)(?: (.+))?/gis
            }
            let isCmd = reg.prefix.exec(this.content)
            if(!isCmd) {
                if(!this.mentions.everyone && this.mentions.users.has(this.client.user.id))
                    isCmd = reg.mention.exec(this.content)
            }
            if(!isCmd) {
                isCmd = reg.nickname.exec(this.content)
            }
            if(isCmd === null) return null

            let params = null

            if(isCmd[2] !== undefined) {
                params = isCmd[2].split(/\s+/g)
            }

            this.type = "COMMAND"
            this.command = isCmd[1].toLowerCase()
            this.params = params
            return this
        }
    },
    "checkIfResponse": {
        value: function() {
            return this.client.db.findResponse(this.content.toLowerCase(), this.author.id, this.guild && this.guild.id).then(res => {
                if(res) {
                    this.type = "RESPONSE"
                    this.responses = res
                }
                return this
            })
        }
    },
    "prefix": {
        get: function() {
            if(this.channel.type === "text")
                return this.channel.guild.prefix
            return this.client.constants.defaults.guildSettings.prefix
        }
    }
})
