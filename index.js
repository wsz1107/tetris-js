const gameStartBtn = document.querySelector('#start-btn')
const rotateBtn = document.querySelector('#roate-btn')
const downBtn = document.querySelector('#down-btn')
const leftBtn = document.querySelector('#left-btn')
const rightBtn = document.querySelector('#right-btn')
const testBtn = document.querySelector('#test-btn')

const canvas = document.querySelector('#main-canvas')
const ctx = canvas.getContext('2d')

let isGameStarted = false
let timer
let score=0
let random=Math.random()
let currentPosX
let currentPosY
let nextTetriminoCoor
let scorePerRow=100
let currentTetrimino
let currentTetriminoMode=0
let FallenBlockMap=[]

gameStartBtn.addEventListener('click', gameStart)
rotateBtn.addEventListener('click', rotate)
downBtn.addEventListener('click', moveDown)
leftBtn.addEventListener('click', moveLeft)
rightBtn.addEventListener('click', moveRight)
testBtn.addEventListener('click',testMsg)

function testMsg(){
    console.log(FallenBlockMap)
}


initialization()

function initialization(){
    ctx.canvas.width=GridCountX*GridSize
    ctx.canvas.height=GridCountY*GridSize
    for(let i=0;i<GridCountY;i++){
        let tempRow=[]
        for(let j=0;j<GridCountX;j++){
            tempRow.push(0)
        }
        FallenBlockMap.push(tempRow)
    }
    //test
    for(let i=1;i<GridCountX;i++){
        FallenBlockMap[19][i]=1
    }
    renderFallenBlock()

    createNewTetromino()
}

function gameStart(){
    if(!timer && !isGameStarted){
        timer = setInterval(moveDown,1000)
        isGameStarted=true
        gameStartBtn.innerText='Pause'
    }else if(isGameStarted){
        isGameStarted=false;
        clearInterval(timer)
        timer=null
        gameStartBtn.innerText='Restart'
    }
}


function renderFallenBlock(){
    for(let i=0;i<GridCountY;i++){
        for(let j=0;j<GridCountX;j++){
            drawBlock(j,i,FallenBlockMap[i][j])
        }
    }
}

function renderTetrimino(t,mode,tf){
    if(tf){
        for(let i=0;i<4;i++){
            drawBlock(t.getCoordinate(mode)[i][0],t.getCoordinate(mode)[i][1],t.getColorIndex())
        }
    }else{
        for(let i=0;i<4;i++){
            drawBlock(t.getCoordinate(mode)[i][0],t.getCoordinate(mode)[i][1],0)
        }
    }
}

function drawBlock(x, y,colorIndex) {
    ctx.fillStyle = Colors[colorIndex]
    ctx.fillRect(x*GridSize, y*GridSize, GridSize, GridSize)
}






