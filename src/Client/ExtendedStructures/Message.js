module.exports = Message => 
class CommandMessage extends Message {
    constructor(client, data, channel) {
        super(client, data, channel)
        this.params = null
    }
    prepareCommand () {
        const reg = {
            DM: /(?:<@!?\d{18}>)? ?(\w+)(?: (.+))?/gis,
            // Remember to escape custom prefix with utils.escapeRegex
            prefix: new RegExp(`^${this.prefix}(\\w+)(?: (.+))?`,"gis"),
            mention: new RegExp(`^<@!?${this.client.user.id}> {0,3}(\\w+)(?: (.+))?`, "gis"),
            nickname: /^patch, {0,3}(\w+)(?: (.+))?/gis
        }
        let isCmd = reg.prefix.exec(this.content)
        if(!isCmd) {
            if(!this.mentions.everyone && this.mentions.users.has(this.client.user.id)) {
                isCmd = reg.mention.exec(this.content)
                if(isCmd !== null) {
                    let mention = new RegExp(`<@!?${this.client.user.id}>`, 'gis')
                    if(isCmd[2] === undefined || !mention.test(isCmd[2])) {
                        this.mentions.users.delete(this.client.user.id)
                        if(this.mentions.members)
                            this.mentions.members.delete(this.client.user.id)
                    }
                }
            }
        }
        if(!isCmd)
            isCmd = reg.nickname.exec(this.content)

        if(!isCmd && this.channel.type === "dm") 
            isCmd = reg.DM.exec(this.content)

        if(isCmd === null)
            return null

        let params = null

        if(isCmd[2] !== undefined) {
            params = isCmd[2].split(/\s+/g)
        }

        this.type = "COMMAND"
        this.command = isCmd[1].toLowerCase()
        this.params = params
        return this
    }

    checkIfResponse() {
        return this.client.db.findResponse(this.content.toLowerCase(), this.author.id, this.guild && this.guild.id).then(res => {
            if(res) {
                this.type = "RESPONSE"
                this.responses = res
            }
            return this
        })
    }

    get prefix() {
        if(this.channel.type === "text")
            return this.channel.guild.prefix
        return this.client.constants.defaults.guildSettings.prefix
    }
}
