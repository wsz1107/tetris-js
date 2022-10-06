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

function addToFallenBlockMap(coordinates, colorIndex) {
    for (let i = 0; i < coordinates.length; i++) {
        FallenBlockMap[coordinates[i][1]][coordinates[i][0]] = colorIndex
    }
}

function rotate() {
    renderTetrimino(currentTetrimino, currentTetriminoMode, 'erase','main')
    let nextMode = (currentTetriminoMode + 1) % currentTetrimino.getMaxModeNum()
    nextTetriminoCoor = currentTetrimino.getCoordinate(nextMode)
    if (!isCollided(nextTetriminoCoor)) {
        renderTetrimino(currentTetrimino, nextMode, 'draw', 'main')
        currentTetriminoMode = nextMode
    } else {
        renderTetrimino(currentTetrimino, currentTetriminoMode, 'draw', 'main')
    }
}

function moveDown() {
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
        currentTetrimino = createNewTetromino(StartPosX, StartPosY, nextTetriminoType)
        currentTetriminoMode=0
        renderTetrimino(nextTetrimino, currentTetriminoMode, 'erase', 'next')
        nextTetriminoType = Math.floor(Math.random() * 7)
        nextTetrimino = createNewTetromino(NextPosX, NextPosY, nextTetriminoType)
        renderTetrimino(nextTetrimino, currentTetriminoMode, 'draw', 'next')

        if (isGameOver()) {
            clearInterval(timer)
        }
        renderFallenBlock()
    }
}

function moveLeft() {
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

function moveRight() {
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

function isCollided(coordinates) {
    for (let i = 0; i < coordinates.length; i++) {
        if (coordinates[i][0] < 0 || coordinates[i][0] >= GridCountX) {
            return true
        }
        if (coordinates[i][1] >= GridCountY) {
            return true
        }
        if (FallenBlockMap[coordinates[i][1]][coordinates[i][0]] != 0) {
            return true
        }
    }
    return false
}

function isGameOver() {
    for (let i = 0; i < currentTetrimino.getCoordinate(currentTetriminoMode).length; i++) {
        if (FallenBlockMap[currentTetrimino.getCoordinate(currentTetriminoMode)[i][1]][currentTetrimino.getCoordinate(currentTetriminoMode)[i][0]] != 0) {
            console.log("Game Over!!!")
            return true
        }
    }
    return false
}

function checkRow() {
    let sum, multi
    let row = GridCountY - 1
    while (true) {
        multi = 1
        sum = 0
        for (let i = 0; i < GridCountX; i++) {
            multi *= FallenBlockMap[row][i]
            sum += FallenBlockMap[row][i]
        }
        if (sum == 0) {
            break;
        }
        if (multi != 0) {
            FallenBlockMap = FallenBlockMap.slice(0, row).concat(FallenBlockMap.slice(row + 1, GridCountY - 1))
            FallenBlockMap.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        } else {
            row--
        }
    }
}


class ITetrimino {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getColorIndex() {
        return 1
    }
    getMaxModeNum() {
        return 2
    }
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