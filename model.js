
let Tt={
    coord:[[5,0],[5,1],[5,2],[5,3]],
    colorInd:1
}
let Ttmode1={
    coord:[[4,1],[5,1],[6,1],[7,1]]
}

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
    getCoordinate(index){
        switch (index) {
            case 0:
                return [[this.x,this.y-1],[this.x,this.y],[this.x,this.y+1],[this.x,this.y+2]]
            case 1:
                return [[this.x-1,this.y],[this.x,this.y],[this.x+1,this.y],[this.x+2,this.y]]
            default:
                return null;
        }
        
    }
}