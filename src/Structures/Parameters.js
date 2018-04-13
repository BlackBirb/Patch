module.exports = class Parameters extends Array {
    constructor(paramsArr) {
        super()
        if(paramsArr && paramsArr.length > 0) {
            for(let i=0;i<paramsArr.length;i++) {
                const param = paramsArr[i]
                if(typeof param === "object") {
                    this[i] = param.value
                    if(param.hasOwnProperty("name"))
                        this[param.name] = param.value
                } else {
                    this[i] = param
                }
            }
        }
    }

    toString() {
        // this.join() can be overwritten if paramter is called "join"
        let str = ""
        for(const p of this) str += " "+p
        return str
    }
}