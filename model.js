class ITetrimino{
    constructor(x,y){
        this.x=x
        this.y=y
    }
    getColorIndex(){
        return 1
    }
    getMaxModeNum(){
        return 2
    }
    getCoordinate(mode){
        switch (mode) {
            case 0:
                return [[this.x,this.y-1],[this.x,this.y],[this.x,this.y+1],[this.x,this.y+2]]
            case 1:
                return [[this.x-1,this.y],[this.x,this.y],[this.x+1,this.y],[this.x+2,this.y]]
            default:
                return null;
        }
        
    }
}



function createNewTetromino(){
    currentPosX=StartPosX
    currentPosY=StartPosY
    currentTetriminoMode=0
    currentTetrimino=new ITetrimino(currentPosX,currentPosY)
}

function addToFallenBlockMap(coordinates,colorIndex){
    for(let i=0;i<coordinates.length;i++){
        FallenBlockMap[coordinates[i][1]][coordinates[i][0]]=colorIndex
    }
}

function rotate(){
    renderTetrimino(currentTetrimino,currentTetriminoMode,false)
    let nextMode=(currentTetriminoMode+1)%currentTetrimino.getMaxModeNum()
    nextTetriminoCoor = currentTetrimino.getCoordinate(nextMode)
    if(!isCollided(nextTetriminoCoor)){
        renderTetrimino(currentTetrimino,nextMode,true)
        currentTetriminoMode=nextMode
    }else{
        renderTetrimino(currentTetrimino,currentTetriminoMode,true)
    }
}

function moveDown() {
    renderTetrimino(currentTetrimino,currentTetriminoMode,false)
    currentTetrimino.y++
    nextTetriminoCoor=currentTetrimino.getCoordinate(currentTetriminoMode)
    if(!isCollided(nextTetriminoCoor)){
        
        renderTetrimino(currentTetrimino,currentTetriminoMode,true)
    }else{
        currentTetrimino.y--
        renderTetrimino(currentTetrimino,currentTetriminoMode,true)
        addToFallenBlockMap(currentTetrimino.getCoordinate(currentTetriminoMode),currentTetrimino.getColorIndex())
        checkRow()
        createNewTetromino()
        if(isGameOver()){
            clearInterval(timer)
        }
        
        renderFallenBlock()
        createNewTetromino()
    }
    
}

function moveLeft(){
    renderTetrimino(currentTetrimino,currentTetriminoMode,false)
    currentTetrimino.x--
    nextTetriminoCoor=currentTetrimino.getCoordinate(currentTetriminoMode)
    if(!isCollided(nextTetriminoCoor)){
        renderTetrimino(currentTetrimino,currentTetriminoMode,true)
    }else{
        currentTetrimino.x++
        renderTetrimino(currentTetrimino,currentTetriminoMode,true)
    }
}

function moveRight(){
    renderTetrimino(currentTetrimino,currentTetriminoMode,false)
    currentTetrimino.x++
    nextTetriminoCoor=currentTetrimino.getCoordinate(currentTetriminoMode)
    if(!isCollided(nextTetriminoCoor)){
        renderTetrimino(currentTetrimino,currentTetriminoMode,true)
    }else{
        currentTetrimino.x--
        renderTetrimino(currentTetrimino,currentTetriminoMode,true)
    }
}

function isCollided(coordinates){
    for(let i=0;i<coordinates.length;i++){
        if(coordinates[i][0]<0 || coordinates[i][0]>=GridCountX){
            return true
        }
        if(coordinates[i][1]>=GridCountY){
            return true
        }
        if(FallenBlockMap[coordinates[i][1]][coordinates[i][0]]!=0){
            return true
        }
    }
    return false
}

function isGameOver(){
    for(let i=0;i<currentTetrimino.getCoordinate(currentTetriminoMode).length;i++){
        if(FallenBlockMap[currentTetrimino.getCoordinate(currentTetriminoMode)[i][1]][currentTetrimino.getCoordinate(currentTetriminoMode)[i][0]]!=0){
            console.log(`x=${currentTetrimino.getCoordinate(currentTetriminoMode)[i][0]}, 
                        y=${currentTetrimino.getCoordinate(currentTetriminoMode)[i][1]},
                        fallen=${FallenBlockMap[currentTetrimino.getCoordinate(currentTetriminoMode)[i][1]][currentTetrimino.getCoordinate(currentTetriminoMode)[i][0]]}`)
            return true
        }
    }
    return false
}

function checkRow(){
    let sum,multi
    let row=GridCountY-1
    while(true){
        multi=1
        sum=0
        for(let i=0;i<GridCountX;i++){
            multi*=FallenBlockMap[row][i]
            sum+=FallenBlockMap[row][i]
        }
        if(sum==0){
            break;
        }
        if(multi!=0){
            FallenBlockMap=FallenBlockMap.slice(0,row).concat(FallenBlockMap.slice(row+1,GridCountY-1))
            FallenBlockMap.unshift([0,0,0,0,0,0,0,0,0,0])
            renderFallenBlock()
        }else{
            row--
        }
    }
}