const msg = ["Hi", "Do", "Patch", "Listen", "eval", "Send"];
function CLI(Scope) {
    const write = t => process.stdout.write(t)
    const app = new Scope(write)
    const commandInput = () => '\u001b[90m'+msg[Math.floor(Math.random()*msg.length)]+":~$ \u001b[39m"
    process.stdin.setEncoding('utf8');
    write(commandInput())
    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) command(chunk.replace("\r\n",""), () => write(commandInput()))
    });
    process.stdin.on("end", () => write("AAA they are killing me!!\r\n") )
    async function command(data, next) {
        if(data.startsWith(":") || data.startsWith(";")) {
            try { 
                const result = await async function(cmd) { // await async? dafuq i'm doing
                    const client = app.client //eslint-disable-line no-unused-vars
                    if(cmd.startsWith(":") || cmd.startsWith(";"))
                        console.log(await eval(cmd.slice(1)))
                    else 
                        await eval(cmd)
                }.call(app,data.slice(1))
                if(result) console.log(result)
            } 
            catch(err) { console.error(err) } 
            return next()
        }
        const regRes = (/^(\w+)(?: (.*$))?/gi).exec(data)
        if(regRes) {
            const cmd = regRes[1]
            const params = regRes[2] ? regRes[2].split(" ") : null
            if(typeof app[cmd] === "function") await app[cmd](params)
            else console.log("Command not found")
            next()
        }
        else {
            write("!"); 
            next()
        }
    }
}

const createScope = client => 
    class Scope {
        constructor(write) {
            this.client = client
            this.write = write
        }
        r(p) { this.reload(p) }
        reload(params) {
            switch(params[0]) {
                case "commands": {
                    return client.registry.reload()
                }
                case "command": {
                    return client.registry.reload(params[1])
                }
                default: console.log("Can't restart that");
            }
        }
    }

module.exports = {
    open: CLI,
    createScope
}