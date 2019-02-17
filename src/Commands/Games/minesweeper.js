const Command = require("../../Structures/Command.js")

// 0b(3)(2)(1)
// 1 - empty cell
// 2 - bomb
// 3 - open cell

module.exports = class Minesweeper extends Command {
    constructor(c, i) {
        super(c, i)

        this.name = "minesweeper"
        this.help = {
            desc: "Generates a game of good ol' minesweeper!",
            format: '<board size> <bombs count>',
            examples: [
                '',
                '10x10',
                '20x20 150'
            ]
        }
        this.aliases = ["minesweeper", "minesweep"]
        
        this.types = { 
            "boardSize": {
                required: false
            },
            "bombsCount": {
                required: false
            }
        }

        this.settings = {
            size: [10, 10],
            bombsCount: 25
        }

        this.numbers = ["❌","1⃣","2⃣","3⃣","4⃣","5⃣","6⃣","7⃣","8⃣"]
        this.bomb = '💣'
    }

    inhibitor(msg, params) {
        if(params.boardSize && (/^(\d+)x(\d+)$/gi).test(params.boardSize))
            params.boardSize = params.boardSize.split('x')
        else if(params.boardSize && !isNaN(parseInt(params.boardSize))) {
            params.bombsCount = parseInt(params.boardSize)
            params.boardSize = this.settings.size
        }
        else
            params.boardSize = this.settings.size
        
        if(params.bombsCount && !isNaN(parseInt(params.bombsCount)))
            params.bombsCount = parseInt(params.bombsCount)
        else
            params.bombsCount = this.settings.bombsCount

        params.tilesCount = params.boardSize[0] * params.boardSize[1]
        
        if(params.tilesCount < 25 || params.boardSize.some(e => e<5)) {
            params.boardSize = [5, 5]
        } else if(params.tilesCount >= 200) {
            params.boardSize = [14, 14]
        }
        params.tilesCount = params.boardSize[0] * params.boardSize[1]

        if(params.bombsCount < 10)
            params.bombsCount = 10
        if(params.tilesCount <= params.bombsCount)
            params.bombsCount = params.boardSize[0] * params.boardSize[1] - 1
        
        return true;
    }

    createBoard(x, y, bombCount) {
        let counter = bombCount
        return Array.from(
            { length: x }, 
            () => Int8Array.from(
                { length: y }, 
                () => {
                    counter--
                    if(counter >= 0)
                        return 1
                    else
                        return 0
                }
            )
        )
    }

    shuffleBoard(board) {
        // for(let x=0;x<board.length;x++) {
        //     for(let y=0;y<board[x].length;y++) {

        for(let x = board.length-1; x >= 0 ; x--) {
            for(let y = board[x].length-1; y >= 0; y--) {
                const index1D = x*(board[x].length) + y
                const rand1dIndex = Math.floor(Math.random()*index1D)
                
                const randX = rand1dIndex % board.length
                const randY = Math.floor(rand1dIndex / board.length)

                // console.log({
                //     index1D,
                //     rand1dIndex,
                //     index2D: `${x}x${y}`,
                //     index2DCalc: `${index1D % board.length}x${Math.floor(index1D / board.length)}`,
                //     rand2dIndex: `${randX}x${randY}`
                // })

                let temp = board[x][y]
                board[x][y] = board[randX][randY]
                board[randX][randY] = temp
            }
        }
    }

    getNeighbourBombsCount(x, y, board) {
        let amount = 0
        for(let ox = -1; ox<=1; ox++) {
            for(let oy = -1; oy<=1; oy++){
                amount += 
                    (board[x + ox] && (board[x + ox][y + oy] === 1)) 
                        ? 1 
                        : 0
            }
        }
        return amount
    }

    getTouchingNeighbourBombsCount(x, y, board) {
        let amount = 0
        amount += (board[x  ] && board[x  ][y-1]) ? 1 : 0
        amount += (board[x-1] && board[x-1][y  ]) ? 1 : 0
        amount += (board[x+1] && board[x+1][y  ]) ? 1 : 0
        amount += (board[x  ] && board[x  ][y+1]) ? 1 : 0
        return amount
    }

    pickOpenCells(board, freeCells, limit = 3) {
        let amount = freeCells <= 3 ? freeCells : limit
        let iterations = board.length * board[0].length * 2 // just in case
        do {
            let x =Math.floor(Math.random()*board.length)
            let y =Math.floor(Math.random()*board[x].length)
            if(board[x][y] === 0) {
                amount -= this.openCell(x, y, board)
            }
            iterations--
        } while(!(amount <= 0 || iterations < 0))
    }

    openCell(x, y, board, amount = 0) {
        board[x][y] = 2
        amount++
        if(this.getNeighbourBombsCount(x, y, board) === 0) {
            for(let ox = -1; ox<=1; ox++) {
                for(let oy = -1; oy<=1; oy++){
                    if(board[x + ox] && (board[x + ox][y + oy] === 0)) {
                        amount = this.openCell(x+ox, y+oy, board, amount)
                    }
                }
            }
        }
        return amount
    }

    async run(msg, params) {

        let board = this.createBoard(...params.boardSize, params.bombsCount)

        this.shuffleBoard(board)

        this.pickOpenCells(board, params.tilesCount - params.bombsCount + 1)

        // let bobmsCounter = 0
        const message = board.map((r, x) => {
            // rows are int8 arrays
            const row = Array.prototype.map.call(r, (cell, y) => {
                if(cell === 2) 
                    return this.numbers[ this.getNeighbourBombsCount(x, y, board) ]
                if(cell === 1) {
                    // bobmsCounter++
                    return `||${this.bomb}||`
                }
                else
                    return `||${this.numbers[ this.getNeighbourBombsCount(x, y, board) ]}||`
            })
            return row.join("")
        })


        //msg.channel.send(`S: ${params.tilesCount}\nD: ${params.boardSize.join('x')} | A: ${board.length}x${board[0].length} | M: ${message.length}\nB: ${params.bombsCount} | A: ${bobmsCounter}\nML: ${message.join('\n').length}`)

        msg.channel.send(`Here's a new minesweeper board for you! The size is **${params.boardSize.join('x')}** and there are **${params.bombsCount} bombs!** Good luck!\n`+message.join('\n'))
    }
}