class Config {
	board = [];
    cop = {x: null, y: null};
    dealers = [];
    maxX = 10;
    maxY = 10;
    money = 0;
    sale = 10;
    gameLoopInterval = null; 
    addictionTimer = 10;
    justcoppedtimer = 2;
    addicts = [];
    runners = [];
    startingStock = 10;
    constructor(){
        for (let x = 0; x < this.maxX; x++){
            this.board.push([]);
            for (let y = 0; y< this.maxY; y++){
                let rand = randNum(0, 2);
                this.board[x][y] = rand;
                for (let i = 0 ; i < rand; i ++){
                    this.addicts.push(this.createAddict(x, y));
                }
            }    
        }
        this.cop.x = this.maxX - 1;
        this.cop.y = this.maxY - 1;
    }

    createAddict(x, y){
        return {x: x, y: y, justCopped: null, addiction: 0}
    }
}