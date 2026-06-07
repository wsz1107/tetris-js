//create tetromino or turn add tetromino to stack 
function createNewTetromino(x, y, type) {
    switch (type) {
        case 0:
            return new ITetrimino(x, y)
        case 1:
            return new OTetrimino(x, y)
        case 2:
            return new STetrimino(x, y)
        case 3:
            return new ZTetrimino(x, y)
        case 4:
            return new JTetrimino(x, y)
        case 5:
            return new LTetrimino(x, y)
        case 6:
            return new TTetrimino(x, y)
        default:
            return null
    }
}

// Set the next tetrimino as the current one, then create a new one for preview
function addTetriminoToCanvas() {
    currentTetriminoMode = 0
    if (typeof nextTetrimino != "undefined" && typeof nextTetriminoType != "undefined") {
        //copy next tetrimino to current one and render it
        currentTetrimino = createNewTetromino(StartPosX, StartPosY, nextTetriminoType)
        //clear the next canvas
        renderTetrimino(nextTetrimino, currentTetriminoMode, 'erase', 'next')
    } else {
        //create a current tetrimino and render it
        nextTetriminoType = Math.floor(Math.random() * 7)
        currentTetrimino = createNewTetromino(StartPosX, StartPosY, nextTetriminoType)
    }
    //create a new next tetrimino and render it
    nextTetriminoType = Math.floor(Math.random() * 7)
    nextTetrimino = createNewTetromino(NextPosX, NextPosY, nextTetriminoType)
}

function addToFallenBlockMap(coordinates, colorIndex) {
    for (let i = 0; i < coordinates.length; i++) {
        FallenBlockMap[coordinates[i][1]][coordinates[i][0]] = colorIndex
    }
}

//Try to rotate the current tetrimino if the next coordinates don't collide.
function rotate() {
    if (isGameStarted) {
        renderTetrimino(currentTetrimino, currentTetriminoMode, 'erase', 'main')
        // Calculate the next rotation mode
        // The mod operator wraps the mode back to 0 after the last state
        // L tetrimino example: 0 -> 1 -> 2 -> 3 -> 0 -> ...
        // O tetrimino example: 0 -> 0 -> ...
        let nextMode = (currentTetriminoMode + 1) % currentTetrimino.getMaxModeNum()
        nextTetriminoCoor = currentTetrimino.getCoordinate(nextMode)
        if (!isCollided(nextTetriminoCoor)) {
            renderTetrimino(currentTetrimino, nextMode, 'draw', 'main')
            currentTetriminoMode = nextMode
        } else {
            renderTetrimino(currentTetrimino, currentTetriminoMode, 'draw', 'main')
        }
    }
}

// Move the current tetrimino down by one cell.
// If it will collide after moving down, fix it to FallenBlockMap, clear completed rows, 
// then generate the next tetrimino.
function moveDown() {
    if (isGameStarted) {
        renderTetrimino(currentTetrimino, currentTetriminoMode, 'erase', 'main')
        currentTetrimino.y++
        nextTetriminoCoor = currentTetrimino.getCoordinate(currentTetriminoMode)
        if (!isCollided(nextTetriminoCoor)) {
            renderTetrimino(currentTetrimino, currentTetriminoMode, 'draw', 'main')
        } else {
            currentTetrimino.y--
            renderTetrimino(currentTetrimino, currentTetriminoMode, 'draw', 'main')
            addToFallenBlockMap(currentTetrimino.getCoordinate(currentTetriminoMode), currentTetrimino.getColorIndex())
            checkRow()
            addTetriminoToCanvas()
            renderTetrimino(nextTetrimino, currentTetriminoMode, 'draw', 'next')
            renderFallenBlock()
            checkGameOver()
        }
    }
}

function moveLeft() {
    if (isGameStarted) {
        renderTetrimino(currentTetrimino, currentTetriminoMode, 'erase', 'main')
        currentTetrimino.x--
        nextTetriminoCoor = currentTetrimino.getCoordinate(currentTetriminoMode)
        if (!isCollided(nextTetriminoCoor)) {
            renderTetrimino(currentTetrimino, currentTetriminoMode, 'draw', 'main')
        } else {
            currentTetrimino.x++
            renderTetrimino(currentTetrimino, currentTetriminoMode, 'draw', 'main')
        }
    }
}

function moveRight() {
    if (isGameStarted) {
        renderTetrimino(currentTetrimino, currentTetriminoMode, 'erase', 'main')
        currentTetrimino.x++
        nextTetriminoCoor = currentTetrimino.getCoordinate(currentTetriminoMode)
        if (!isCollided(nextTetriminoCoor)) {
            renderTetrimino(currentTetrimino, currentTetriminoMode, 'draw', 'main')
        } else {
            currentTetrimino.x--
            renderTetrimino(currentTetrimino, currentTetriminoMode, 'draw', 'main')
        }
    }

}


//Check whether the given coordinates collides with wall, the bottom or existing fixed blocks
function isCollided(coordinates) {
    if (isGameStarted) {
        for (let i = 0; i < coordinates.length; i++) {
            // left or right wall
            if (coordinates[i][0] < 0 || coordinates[i][0] >= GridCountX) {
                return true
            }
            // bottom
            if (coordinates[i][1] >= GridCountY) {
                return true
            }
            // existing fixed blocks
            if (FallenBlockMap[coordinates[i][1]][coordinates[i][0]] != 0) {
                return true
            }
        }
        return false
    }
}

function checkGameOver() {
    for (let i = 0; i < currentTetrimino.getCoordinate(currentTetriminoMode).length; i++) {
        if (FallenBlockMap[currentTetrimino.getCoordinate(currentTetriminoMode)[i][1]][currentTetrimino.getCoordinate(currentTetriminoMode)[i][0]] != 0) {
            isGameOver=true
            clearInterval(timerID)
            timerID=null
            console.log("Game Over!!!")
            renderGameStatus("Gameover")
        }
    }
}

// Check completed rows from bottom to top.
// If there is not any empty cell in a row, remove that row and add a new empty row at the top.
function checkRow() {
    // sum represents the sum of all values in a row. If 0, means all cells are empty.
    // multi represents the product of all values in a row. If 0, means any cell is empty.
    let sum, multi
    let row = GridCountY - 1
    while (true) {
        multi = 1
        sum = 0
        for (let i = 0; i < GridCountX; i++) {
            multi *= FallenBlockMap[row][i]
            sum += FallenBlockMap[row][i]
        }
        // If a row is completely empty, it isn't necessary to check the rows above
        if (sum === 0) {
            break;
        }
        // If a row is full, remove that row and add a new empty row at the top
        if (multi !== 0) {
            FallenBlockMap = FallenBlockMap.slice(0, row).concat(FallenBlockMap.slice(row + 1, GridCountY - 1))
            FallenBlockMap.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            score += 10
            renderScore()
        } else {
            row --
        }
    }
}


//Tetrimino's class
class ITetrimino {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getColorIndex() {
        return 1
    }
    // Return the number of rotation states for this kind of tetrimino
    // I, S, Z have 2 states, O has 1 state, J,L, T have 4 states.
    getMaxModeNum() {
        return 2
    }
    // Return the 4 blocks' coordinates occupied by this terimino.
    // mode represents the rotation state.
    getCoordinate(mode) {
        switch (mode) {
            case 0:
                return [[this.x, this.y - 1], [this.x, this.y], [this.x, this.y + 1], [this.x, this.y + 2]]
            case 1:
                return [[this.x - 1, this.y], [this.x, this.y], [this.x + 1, this.y], [this.x + 2, this.y]]
            default:
                return null;
        }
    }
}

class OTetrimino {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getColorIndex() {
        return 2
    }
    getMaxModeNum() {
        return 1
    }
    getCoordinate(mode) {
        switch (mode) {
            case 0:
                return [[this.x - 1, this.y - 1], [this.x, this.y - 1], [this.x - 1, this.y], [this.x, this.y]]
            default:
                return null;
        }
    }
}

class STetrimino {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getColorIndex() {
        return 3
    }
    getMaxModeNum() {
        return 2
    }
    getCoordinate(mode) {
        switch (mode) {
            case 0:
                return [[this.x, this.y], [this.x + 1, this.y], [this.x - 1, this.y + 1], [this.x, this.y + 1]]
            case 1:
                return [[this.x, this.y - 1], [this.x, this.y], [this.x + 1, this.y], [this.x + 1, this.y + 1]]
            default:
                return null;
        }
    }
}

class ZTetrimino {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getColorIndex() {
        return 4
    }
    getMaxModeNum() {
        return 2
    }
    getCoordinate(mode) {
        switch (mode) {
            case 0:
                return [[this.x - 1, this.y], [this.x, this.y], [this.x, this.y + 1], [this.x + 1, this.y + 1]]
            case 1:
                return [[this.x, this.y - 1], [this.x - 1, this.y], [this.x, this.y], [this.x - 1, this.y + 1]]
            default:
                return null;
        }
    }
}

class JTetrimino {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getColorIndex() {
        return 5
    }
    getMaxModeNum() {
        return 4
    }
    getCoordinate(mode) {
        switch (mode) {
            case 0:
                return [[this.x - 1, this.y - 1], [this.x - 1, this.y], [this.x, this.y], [this.x + 1, this.y]]
            case 1:
                return [[this.x, this.y - 1], [this.x, this.y], [this.x - 1, this.y + 1], [this.x, this.y + 1]]
            case 2:
                return [[this.x - 1, this.y], [this.x, this.y], [this.x + 1, this.y], [this.x + 1, this.y + 1]]
            case 3:
                return [[this.x, this.y - 1], [this.x + 1, this.y - 1], [this.x, this.y], [this.x, this.y + 1]]

            default:
                return null;
        }
    }
}

class LTetrimino {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getColorIndex() {
        return 6
    }
    getMaxModeNum() {
        return 4
    }
    getCoordinate(mode) {
        switch (mode) {
            case 0:
                return [[this.x - 1, this.y], [this.x, this.y], [this.x + 1, this.y], [this.x - 1, this.y + 1]]
            case 1:
                return [[this.x, this.y - 1], [this.x, this.y], [this.x, this.y + 1], [this.x + 1, this.y + 1]]
            case 2:
                return [[this.x + 1, this.y - 1], [this.x - 1, this.y], [this.x, this.y], [this.x + 1, this.y]]
            case 3:
                return [[this.x - 1, this.y - 1], [this.x, this.y - 1], [this.x, this.y], [this.x, this.y + 1]]

            default:
                return null;
        }
    }
}

class TTetrimino {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getColorIndex() {
        return 7
    }
    getMaxModeNum() {
        return 4
    }
    getCoordinate(mode) {
        switch (mode) {
            case 0:
                return [[this.x, this.y - 1], [this.x - 1, this.y], [this.x, this.y], [this.x + 1, this.y]]
            case 1:
                return [[this.x, this.y - 1], [this.x - 1, this.y], [this.x, this.y], [this.x, this.y + 1]]
            case 2:
                return [[this.x - 1, this.y], [this.x, this.y], [this.x + 1, this.y], [this.x, this.y + 1]]
            case 3:
                return [[this.x, this.y - 1], [this.x, this.y], [this.x + 1, this.y], [this.x, this.y + 1]]
            default:
                return null;
        }
    }
}