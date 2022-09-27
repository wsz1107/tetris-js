const gameStartBtn = document.querySelector('#start-btn')
const testBtn = document.querySelector('#test-btn')
gameStartBtn.addEventListener('click', gameStart)
testBtn.addEventListener('click', rotate)
const canvas = document.querySelector('#main-canvas')
const ctx = canvas.getContext('2d')

let isGameStarted = false
let timer

const directionCoordinate=[[1,0],[-1,0],[0,1]]

let score=0
let random=Math.random()
let currentPosX
let currentPosY
let scorePerRow=100

let currentTetrimino
let currentTetriminoMode=0


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
        // FallingBlockMap.push(tempRow)
    }
    currentPosX=StartPosX
    currentPosY=StartPosY
    currentTetrimino=new ITetrimino(StartPosX,StartPosY)
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
            if(FallenBlockMap[i][j]!=0){
                drawBlock(j, i,Colors[FallenBlockMap[i][j]])
            }
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

function rotate(){
    renderTetrimino(currentTetrimino,currentTetriminoMode,false)
    currentTetriminoMode++
    currentTetriminoMode=currentTetriminoMode%currentTetrimino.getMaxModeNum()
    renderTetrimino(currentTetrimino,currentTetriminoMode,true)
}


function moveDown() {
    renderTetrimino(currentTetrimino,currentTetriminoMode,false)
    currentTetrimino.y++
    console.log(currentTetrimino.y)
    renderTetrimino(currentTetrimino,currentTetriminoMode,true)
}




