class Config {
	board = [];    
    cop = {x: null, y: null, direction: null, moveIn: null, turnIn: null};
    copMovesEvery = 2;
    costs = {
        dealer: 100,
        dealerUpgrade: 100,
        product: 1000,
        runner: 100,
        runnerUpgrade: 100,
        
    };
    dealers = [];
    deltaX = {up: 0, right: 1, down: 0, left: -1};
    deltaY = {up: -1, right: 0, down: 1, left: 0};
    directions = ['up', 'right', 'down', 'left'];
    heat = [];
    maxX = 10;
    maxY = 10;
    money = 0;
    sale = 10;
    gameLoopInterval = null; 
    addictionTimer = 10;
    justcoppedtimer = 2;
    addicts = [];
    prices = [];
    product = 1000;
    maxAddicts = 8;
    runners = [];

    runnerCapacity = 10;
    dealerCapacity = 10;

    runnerQueue = [];
    startingStock = 40;
    staff = {
        dealers: 1,
        runners: 1,
    }
    traphouse = {x: null, y: null};
    constructor(){
        this.traphouse.x = randNum(0, this.maxX - 1);
        this.traphouse.y = randNum(0, this.maxY - 1);
        
        for (let x = 0; x < this.maxX; x++){
            this.board.push([]);
            this.heat.push([]);
            this.prices.push([]);
            
            for (let y = 0; y< this.maxY; y++){
                let cost = 0;
                if (distance(this.traphouse.x, x, this.traphouse.y, y) > 2){
                    cost = randNum(1, this.sale * 2);
                }
                this.heat[x][y] = 0;
                this.prices[x][y] = cost;
                let rand = randNum(1, 2);
                this.board[x][y] = rand;
                for (let i = 0 ; i < rand; i ++){
                    this.addicts.push(this.createAddict(x, y));
                }
            }    
        }
        this.cop.x = 10 - this.traphouse.x;
        this.cop.y = 10 - this.traphouse. y;
        this.cop.direction = this.directions[randNum(0, this.directions.length - 1)];
        this.cop.moveIn = this.copMovesEvery;
        this.cop.turnIn = randNum(1, Math.round((this.maxX + this.maxY) / 2)  )
    }

    createAddict(x, y){
        return {x: x, y: y, justCopped: null, addiction: 0}
    }
}