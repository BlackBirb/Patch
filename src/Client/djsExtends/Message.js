module.exports = Discord => 
Object.defineProperties(Discord.Message.prototype, {
    "params": {
        value: null,
        writable: true,
        configurable: true
    },
    "name": {
        value: null,
        writable: true
    },
    "isCommand": {
        value: false,
        writable: true
    },
    "prepareCommand": {
        value: function() {
            const reg = {
                prefix: new RegExp(`^${this.prefix}(\\w+)(?: (.+))?`,"gi"),
                mention: /^<@!?\d{18}> ?(\w+)(?: (.+))?/gi,
                nickname: /^Patch, ?(\w+)(?: (.+))?/gi
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

            const name = isCmd[1]
            let params = null

            if(isCmd[2] !== undefined) {
                params = isCmd[2].split(" ")
            }

            this.isCommand = isCmd !== null
            this.name = name
            this.params = params
            return this
        }
    },
    "prefix": {
        get: function() {
            return this.channel.guild.prefix
        }
    }
})