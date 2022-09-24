const gameStartBtn = document.querySelector('#start-btn')
gameStartBtn.addEventListener('click', gameStart)
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let isGameStarted = false
let timer

const startPosX=10
const startPosY=10
const gridCountX=10
const gridCountY=20
const gridSize = 10
const scorePerRow=100
const fallspeed=1
const directionCoordinate=[[1,0],[-1,0],[0,1]]

let fallenGridMap=[]
let fallingGridMap=[]
let score=0
let random=Math.random()
let currentPosX = 10
let currentPosY = 10


function initialization(){
    ctx.canvas.width=gridCountX*gridSize
    ctx.canvas.height=gridCountY*gridSize
}


function drawBlock(x, y) {
    ctx.fillStyle = 'green'
    ctx.fillRect(x, y, gridSize, gridSize)
}


function fall() {
    if(isGameStarted){
        currentPosY += gridSize
        drawBlock(currentPosX, currentPosY)
        console.log("fall")
    }
}



function gameStart(){
    console.log("isGameStarted:%s;interval:%s",isGameStarted,timer)
    if(!timer && !isGameStarted){
        timer = setInterval(fall,1000)
        isGameStarted=true
        gameStartBtn.innerText='Pause'
    }else if(isGameStarted){
        isGameStarted=false;
        clearInterval(timer)
        timer=null
        gameStartBtn.innerText='Restart'
    }
}