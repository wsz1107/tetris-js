const gameStartBtn = document.querySelector('#start-btn')
const rotateBtn = document.querySelector('#roate-btn')
const downBtn = document.querySelector('#down-btn')
const leftBtn = document.querySelector('#left-btn')
const rightBtn = document.querySelector('#right-btn')
const testBtn = document.querySelector('#test-btn')

const canvas = document.querySelector('#main-canvas')
const ctx = canvas.getContext('2d')

const canvasNext = document.querySelector('#nextT-canvas')
const ctxNext = canvasNext.getContext('2d')

let isGameStarted = false
let timer
let score = 0
let randomIndex
let currentPosX
let currentPosY
let nextTetriminoCoor
let scorePerRow = 100
let currentTetrimino
let nextTetriminoType
let currentTetriminoMode = 0
let FallenBlockMap = []

gameStartBtn.addEventListener('click', gameStart)
rotateBtn.addEventListener('click', rotate)
downBtn.addEventListener('click', moveDown)
leftBtn.addEventListener('click', moveLeft)
rightBtn.addEventListener('click', moveRight)
testBtn.addEventListener('click', testMsg)

function testMsg() {
    console.log(nextTetrimino.getCoordinate(0))
}


initialization()

function initialization() {
    ctx.canvas.width = GridCountX * GridSize
    ctx.canvas.height = GridCountY * GridSize
    nextTetriminoType = Math.floor(Math.random() * 7)
    currentTetrimino = createNewTetromino(StartPosX, StartPosY, nextTetriminoType)
    nextTetriminoType = Math.floor(Math.random() * 7)
    nextTetrimino = createNewTetromino(NextPosX, NextPosY, nextTetriminoType)
    renderTetrimino(nextTetrimino, currentTetriminoMode, 'draw', 'next')
    for (let i = 0; i < GridCountY; i++) {
        let tempRow = []
        for (let j = 0; j < GridCountX; j++) {
            tempRow.push(0)
        }
        FallenBlockMap.push(tempRow)
    }
    //test
    for (let i = 1; i < GridCountX; i++) {
        FallenBlockMap[19][i] = 1
    }
    renderFallenBlock()
}

function gameStart() {
    if (!timer && !isGameStarted) {
        timer = setInterval(moveDown, 1000)
        isGameStarted = true
        gameStartBtn.innerText = 'Pause'
    } else if (isGameStarted) {
        isGameStarted = false;
        clearInterval(timer)
        timer = null
        gameStartBtn.innerText = 'Restart'
    }
}


function renderFallenBlock() {
    for (let i = 0; i < GridCountY; i++) {
        for (let j = 0; j < GridCountX; j++) {
            drawBlock(j, i, FallenBlockMap[i][j], 'main')
        }
    }
}

function renderTetrimino(t, mode, type, canvas) {
    if (type === 'draw') {
        for (let i = 0; i < 4; i++) {
            drawBlock(t.getCoordinate(mode)[i][0], t.getCoordinate(mode)[i][1], t.getColorIndex(), canvas)
        }
    } else {
        for (let i = 0; i < 4; i++) {
            drawBlock(t.getCoordinate(mode)[i][0], t.getCoordinate(mode)[i][1], 0, canvas)
        }
    }
}

function drawBlock(x, y, colorIndex, canvas) {
    if (canvas === 'main') {
        ctx.fillStyle = Colors[colorIndex]
        ctx.fillRect(x * GridSize, y * GridSize, GridSize, GridSize)
    } else {
        ctxNext.fillStyle = Colors[colorIndex]
        ctxNext.fillRect(x * GridSize, y * GridSize, GridSize, GridSize)
    }

}
