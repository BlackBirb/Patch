/* eslint-disable */
const Command = require("../../Structures/Command.js")

module.exports = class Test extends Command {
    constructor(client, id) {
        // YOU MUST pass 2 props from constructor to super
        super(client, id)
        
        // default command name
        this.name = "test"

        /** Command help
         * 
         * text - short or not explanation about command, 
         * 
         * format - properly formated suffix description can be array
         *          @optional but recomended
         * 
         * examples - array of examples on how to use command
         *            @optional 
         */
        this.help = {
            desc: "Don't us this commands, it's made only to show how to create one.",
            format: "[Number] <String> / hello <name>",
            examples: [
                "321 FOO",
                "123",
            ]
        }
        
        /** aliases for command, duh 
         * @optional null
         */
        this.aliases = ["testing"]
        
        /** Permissions can be found at /src/Client/Utils/Constants
         * Never write them as numbers, they might change
         * DEFAULT permissions mean that if admin changes default permissions for user they won't work
         * @optional default
         */
        this.permissions = this.client.constants.PERMISSIONS.DEFAULT
        
        /** If ture this command will work even if channel or build is blacklisted/inactvie
         * @optional false
         */
        this.ignoreBlacklist = false

        /** On what channel types command should work
         * @optional all
         */
        this.channels = ["text", "dm"]

        /** array or string of permissions that bot must have to even run command
         * 
         * Always checks for "VIEV_CHANNEL" "SEND_MESSAGES" by default
         */
        this.requiredPermissions = "ADD_REACTIONS"

        /** this command won't be initialized, nothing will see it.
         * @optional false
         */
        this.disabled = true

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
                    err: "Need some number!"
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
        this.initialData = () => ({
            "guildData": 0
        })
    }

    /**
     * Add type checks etc. to this function, returning false (Has to be boolean "false") will stop command from executing
     * Everything that this inhibitor changes will be preserved
     */
    inhibitor(msg, params, utils) {
        return true
    }

    /**
     * You create subcommand just by adding function `sub<commandName>`
     * It get the same args as normal run function.
     */
    subhello(msg, params, utils) {

    }

    /**
     * You can have any function in command you want, and it won't be subcommand as long as it donesn't starts with sub
     */
    test() {
        return true
    }

    /**
     * This function will be called when user uses this command, if subcommand wasn't triggered.
     * @param {Object} msg Discord.js message expanded by bot functions.
     * @param {Parameters} params Array-object like thing, you can get to parameters with index (all parameters that user passed are indexed) or with name if specified in this.types, only specified params can be accesed this way. Calling .toString() will return all params joined with space (" ")
     * @param {Object} utils look at /src/Structures/Command.js before command call for more info
     */
    async run(msg, params, { voice, voiceManager, utils, etc }) {
        console.log(this.data)
        //msg.reply(`Yep. Command ${this.name} works\n${data.guildData},  ${this.test()}`);
        msg.reply("aaaa")
        this.data.guildData += 1
        
    }
}