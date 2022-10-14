const gameStartBtn = document.querySelector('#start-btn')
const rotateBtn = document.querySelector('#roate-btn')
const downBtn = document.querySelector('#down-btn')
const leftBtn = document.querySelector('#left-btn')
const rightBtn = document.querySelector('#right-btn')
const testBtn = document.querySelector('#test-btn')
const canvas = document.querySelector('#main-canvas')
const canvasNext = document.querySelector('#next-canvas')

const ctxMain = canvas.getContext('2d')
const ctxNext = canvasNext.getContext('2d')

let isGameStarted = false
let isGameOver = false
let timerID
let score = 0
let randomIndex
let currentPosX
let currentPosY
let nextTetriminoCoor
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
document.addEventListener('keyup',control)

initialization()

//game status funcs
function initialization() {
    for (let i = 0; i < GridCountY; i++) {
        FallenBlockMap.push([0,0,0,0,0,0,0,0,0,0])
    }
    addTetriminoToCanvas()
    ctxNext.font='14px serif'
    ctxNext.fillStyle='black'
    ctxNext.fillText(' Next:',0,GridSize*2)
    renderScore()
    // testData()
}

function gameStart() {
    if (!timerID && !isGameStarted && !isGameOver) {
        timerID = setInterval(moveDown, 1000)
        isGameStarted = true
        gameStartBtn.innerText = 'Pause'
        ctxMain.fillStyle='white'
        ctxMain.fillText("Pause",5*GridSize,10*GridSize)
        renderFallenBlock()
        renderTetrimino(currentTetrimino,currentTetriminoMode,'draw','main')
        renderTetrimino(nextTetrimino, currentTetriminoMode, 'draw', 'next')
        renderScore()
    } else if (isGameStarted && !isGameOver) {
        isGameStarted = false;
        clearInterval(timerID)
        timerID = null
        renderGameStatus("Pause")
        gameStartBtn.innerText = 'Restart'
    }
}


//controller funcs
function control(e){
    if(isGameStarted && !isGameOver){
        if(e.keyCode === 37 || e.keyCode === 65){
            moveLeft()
          }else if(e.keyCode === 38 || e.keyCode=== 87){
            rotate()
          }else if(e.keyCode === 39 || e.keyCode === 68){
            moveRight()
          }else if(e.keyCode === 40 || e.keyCode === 83){
            moveDown()
          }
    }
  }
  

//render funcs
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
        ctxMain.fillStyle = Colors[colorIndex]
        ctxMain.fillRect(x * GridSize, y * GridSize, GridSize, GridSize)
    } else {
        ctxNext.fillStyle = Colors[colorIndex]
        ctxNext.fillRect(x * GridSize, y * GridSize, GridSize, GridSize)
    }
}

function renderGameStatus(status){
    ctxMain.fillStyle = 'rgba('+[96,96,96,0.5]+')'
    ctxMain.fillRect(0,7*GridSize,GridCountX * GridSize,5*GridSize)
    ctxMain.font = '24px serif'
    ctxMain.fillStyle = 'white'
    ctxMain.textAlign = 'center'
    ctxMain.fillText(status,5*GridSize,10*GridSize)
}

function renderScore(){
    ctxNext.fillStyle='white'
    ctxNext.fillRect(0,9*GridSize,5*GridSize,3*GridSize)
    ctxNext.fillStyle='black'
    ctxNext.fillText(' Score:',0,10*GridSize)
    ctxNext.fillText(score.toString(),2*GridSize,12*GridSize)
}


//test funcs
function testMsg() {
    console.log(FallenBlockMap)
    // renderGameStatus("status")
}

function testData(){
    for (let i = 1; i < GridCountX; i++) {
        FallenBlockMap[19][i] = 1
    }
}
