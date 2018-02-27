/* eslint-disable */
const Command = require("../../Structures/Command.js")

module.exports = class Help extends Command {
    constructor(client, id) {
        // YOU MUST pass 2 props from constructor to super
        super(client, id)
        
        // default command name
        this.name = "test"
        
        // aliases for command, duh 
        // @optional
        this.aliases = ["testing"]
        
        // define them later
        this.premissions = 0b1
        
        // on what channel types command should work
        this.channels = ["text", "dm"]

        // this command won't be initialized, nothing will see it.
        // @optional
        this.disabled = false

        /**
         * You can define types for you command, you can later access them in run with params.nameYouSpecified
         * 
         * If you have subcommands you can define types for each subcommand 
         * but 
         * You don't have to do just `run:` if you don't care about other subcommands types, you can just go to types without `run:` an it will only work on run
         * 
         * <Object> {
         *     subcommandName? {
         *          paramName: {
         *              required?: <Boolean>
         *              err?: <String>
         *          }
         *     }
         * }
         * 
         * @optional
         */
        this.types = { 
            hello: {
                "name": {
                    required: false
                }
            },
            run: {
                "number": {
                    required: true,
                    err: "Ripp"
                },
                "k": {}
            }
        }

        /**
         * Function that returns object!
         * 
         * Each guild will have it's own version of object returned by this.data, you can acces it in any command function just like it would be in this object, so `this.data`
         * 
         * @optional
         */
        this.data = () => ({
            "guildData": 0
        })
    }

    /**
     * You create subcommand just by adding function `sub<commandName>`
     * It get the same args as normal run function.
     */
    subhello(msg, params, cmdName) {

    }

    /**
     * This function will be called when user uses this command, if subcommand wasn't triggered.
     * @param {Object} msg Discord.js message expanded by bot functions.
     * @param {Parameters} params Array-object like thing, you can get to parameters with index (all parameters that user passed are indexed) or with name if specified in this.types, only specified params can be accesed this way
     * @param {String} cmdName Name of the command, idk why
     */
    async run(msg, params, cmdName) {
        this.test()
        console.log(this.data)
        msg.reply(`Yep. Command ${this.name} works\n${this.data.guildData}`);

        this.data.guildData += 1
        
    }
}