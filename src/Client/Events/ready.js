
module.exports = function(evn) {
    if(typeof evn === "string") {
        console.log("Fake test loaded!")
    }
    else console.log(`[${new Date().toLocaleString()}]`,"Logged to discord!")
}