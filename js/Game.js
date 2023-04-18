class Game{
	config = new Config();	
	constructor(){
		this.config.gameLoopInterval =  setInterval(this.looping, 1000);
	}

	arrest(){
		let dealerID = this.fetchDealer(this.config.cop.x, this.config.cop.y);
		if (dealerID == null){
			console.log('arrest null');
			return;
		}
		let dealer = this.config.dealers[dealerID];
		if (dealer.product < 1){
			console.log('nothing on them!');
			return;
		}
		this.config.dealers.splice(dealerID, 1);
	}

	arrestRunner(){
		for (let i in this.config.runners){
			let runner = this.config.runners[i];			
			if (this.config.cop.x != runner.x 
				&& this.config.cop.y != runner.y){
				continue;
			}
			if (runner.product > 0){
				this.config.runners.splice(i, 1);
				
			}
		}
	}

	buy(id){
		if (this.config.money < this.config.costs[id]){
			return;
		}
		this.config.money -= this.config.costs[id];
		this.config.costs[id] *= 2;
		if (id == 'product'){
			this.config.product += 1000;
			return;
		}
		if (id.substring(id.length - ('Upgrade').length) == 'Upgrade'){
			this.config[id.substring(0, id.length - ('Upgrade').length) + "Capacity"] += 10;
			return;
		}
		this.config.staff[id + 's'] ++;
	}



	buyDrugs(addictID){
		let addict = this.config.addicts[addictID];
		let dealerID 
			= this.fetchDealer(this.config.addicts[addictID].x, 
				this.config.addicts[addictID].y);				
		let dealer = this.config.dealers[dealerID];		
		if (dealerID == null){
			return;
		}
		if (this.config.addicts[addictID].justCopped != null 
			|| this.config.addicts[addictID].addiction != 0 
			||  dealer.product < 1){
			return;
		}
		this.heatItUp(addict.x, addict.y);
		this.config.addicts[addictID].justCopped = this.config.justcoppedtimer;
		this.config.addicts[addictID].addiction = this.config.addictionTimer;
		this.config.money += this.config.prices[dealer.x][dealer.y];
		this.config.dealers[dealerID].product--;
		let rand = randNum(1, 10);
		if (rand == 1 && this.config.prices[addict.x][addict.y] > 1){
			this.config.prices[addict.x][addict.y] -- ;
			this.increasePrice();
		}

		if (this.config.dealers[dealerID].product < 1 && this.config.product > 0){			
			if (this.config.dealers[dealerID].deleting){
				this.config.dealers.splice(dealerID, 1);
				this.config.staff.dealers ++;
				return;
			}
			
			this.sendRunner(dealerID);
		}
	}

	coolDown(){
		let randX = randNum(0, this.config.maxX - 1);
		let randY = randNum(0, this.config.maxY - 1);
		if (this.config.heat[randX][randY] > 0){
			this.config.heat[randX][randY] --;
		}
	}

	copWander(){
		let delta = [-1, 0, 1];
		let newX = null, newY = null;
		this.config.cop.moveIn -- ;
		if (this.config.cop.moveIn > 0){
			return;
			
		}
		this.config.cop.moveIn = this.config.copMovesEvery;
		this.config.cop.turnIn -- ;
		while (1){
			newX = this.config.cop.x + this.config.deltaX[this.config.cop.direction];
			newY = this.config.cop.y + this.config.deltaY[this.config.cop.direction];
			if (this.config.cop.turnIn == 0 || newX < 0 || newX > this.config.maxX - 1
				|| newY < 0 || newY > this.config.maxY - 1){
				let dir = this.config.directions.indexOf(this.config.cop.direction);
				dir ++;
				if (dir > this.config.directions.length - 1){
					dir = 0;
				}
				this.config.cop.direction = this.config.directions[dir];
				this.config.cop.turnIn = randNum(0, 10);
				continue;
			}
			break;
		}
		
		
		this.config.cop.x = newX; 
		this.config.cop.y = newY;
		/*
		let minX = this.config.cop.x - 1, maxX = this.config.cop.x + 1;
		let minY = this.config.cop.y - 1, maxY = this.config.cop.y + 1;
		let option = {space: [], high: 0};
		for (let y = minY; y <= maxY; y++){
			for (let x = minX; x <= maxX; x++){
				if (x < 0 || x >= this.config.maxX ||  
					y < 0 || y >= this.config.maxY
					|| (x  == this.config.cop.x && y == this.config.cop.y) 
					|| this.config.board[x][y] < option.high){
					continue;
				}				
				if (this.config.board[x][y] > option.high){
					option.high = this.config.board[x][y];
					option.space = [];					
				} 			
				option.space.push({x: x, y: y});
			}
		}
		let rand = randNum(0, option.space.length - 1);
		
		this.config.cop.x = option.space[rand].x;
		this.config.cop.y = option.space[rand].y;
		*/
/*
		while(1){
			let randX = this.config.cop.x + delta[randNum(0, delta.length - 1)];
			let randY = this.config.cop.y + delta[randNum(0, delta.length - 1)];
			if (randX < 0 || randX > this.config.maxX - 1 
				|| randY < 0 || randY > this.config.maxY -1
				|| (this.config.cop.x == randX && this.config.cop.y == randY)){
				continue;
			}
			this.config.cop.x = randX;
			this.config.cop.y = randY;
			return;
		}
		*/
	}

	dealer(x, y){
		if (distance(this.config.traphouse.x, x, this.config.traphouse.y, y) < 3 ){
			return;
		}

		if (game.isThereADealerHere(x, y)){
			let dealerID = this.fetchDealer(x, y);
			this.config.dealers[dealerID].deleting = true;						
			return;
			
		}
		if (this.config.staff.dealers < 1){
			return;
		}
		this.config.staff.dealers --;
		this.config.dealers.push({x: x, y: y, product: 0, deleting: false});
		this.sendRunner(this.config.dealers.length - 1);
	}

	fetchDealer(x, y){
		let minX = x - 1, maxX = x + 1, minY = y - 1, maxY = y + 1;
		for (let i in this.config.dealers){
			let dealer = this.config.dealers[i];
			if (dealer.x >= minX && dealer.x <= maxX 
				&& dealer.y >= minY && dealer.y <= maxY){
					
				return i;
			}
		}
		return null;
	}
	
	fetchNearestSatiate(x, y){
				
		let minX = x - 1;
		let maxX = x + 1;
		let minY = y - 1;
		let maxY = y + 1;
		let high = {count: 0, id: null};		
		for (let i in game.config.addicts){
			let addict = game.config.addicts[i];
			if (addict.justCopped == null){
				continue;
			}
			if (addict.x >= minX  && addict.x <= maxX
				&& addict.y >= minY && addict.y <= maxY){
				return i;						
			}
		}
		return null;
	}

	heatItUp(x, y){
		let delta = [-1, 0, 1];
		let n = 0;
		let rand = randNum(1, 10);
		this.coolDown();
		if (rand != 1){
			return;
		}
		console.log('fire');
		if (this.config.heat[x][y] < 3){
			this.config.heat[x][y]++;
			return;
		}		
		while(1){
			let newX = x + delta[randNum(0, delta.length - 1)];
			let newY = y + delta[randNum(0, delta.length - 1)];
			if (n > 100){
				break;
			}
			if (newX < 0 || newX > this.config.maxX - 1 				
				|| newY < 0 || newY > this.config.maxY - 1
				|| this.config.heat[newX][newY] >= 3){
				n++;
				continue;
			}
			this.config.heat[newX][newY] ++;
		}
	}

	increasePrice(){
		while(1){
			let randX = randNum(0, this.config.maxX - 1);
			let randY = randNum(0, this.config.maxY - 1);
			
			if (distance(this.config.traphouse.x, randX, this.config.traphouse.y, randY) <= 2){
				continue;
			}
			this.config.prices[randX][randY]++;
			return;
		}
	}

	isDealerNearby(x, y){
		let minX = x - 1, maxX = x + 1, minY = y -1, maxY = y + 1;
		for (let i in this.config.dealers){
			let dealer = this.config.dealers[i];

			if (dealer.x >= minX && dealer.x <= maxX 
				&& dealer.y >= minY && dealer.y <= maxY 
				&& this.config.dealers[i].product > 0){
				return i;
			}
		}
		return null;

	}
	
	isThereADealerHere(x, y){
		for (let i in this.config.dealers){
			if (this.config.dealers[i].x == x && this.config.dealers[i].y == y){ // check later for product				
				return true;
			}
		}
		return false;
	}

	isThereARunnerHere(x, y){
		for (let i in this.config.runners){
			let runner = this.config.runners[i];
			if (runner.x == x && runner.y == y){
				return true;
			}
		}
		return false;
	}


	fetchHighestPriceForDealer(dealerID){
		let dealer = this.config.dealers[dealerID];
		let high = 0;
		if (dealerID == null){
			console.log('error');
			return;
		}
		for (let x = dealer.x - 1; x <= dealer.x + 1; x++){
			for (let y = dealer.y - 1; y <= dealer.y + 1; y++){
				if (x < 0 || x > this.config.maxX - 1
					|| y < 0 || y > this.config.maxY - 1){
					continue;
				}

				if (this.config.prices[x][y] > high ){
					high = this.config.prices[x][y];
				}
			}
		}
		return high;
	}

	looping(){
		
		for (let addictID in game.config.addicts){			
			
			let addict = game.config.addicts[addictID];
			if (addict.addiction != 0){
				game.wander(addictID);
				continue;
			}
			let nearestDealer = game.isDealerNearby(addict.x, addict.y);
			
			if (nearestDealer != null && game.fetchHighestPriceForDealer(nearestDealer) == game.config.prices[addict.x][addict.y]){
				//console.log(game.config.prices[addict.x][addict.y], game.fetchHighestPriceForDealer(nearestDealer));
				game.buyDrugs(addictID);
				continue;
			}

			let nearestSatiated = game.fetchNearestSatiate(addict.x, addict.y);
			if (nearestSatiated == null){
				game.wander(addictID);
				continue;
			}
			game.move(addictID, 
				game.config.addicts[nearestSatiated].x, game.config.addicts[nearestSatiated].y);


		}

		for (let runnerID in game.config.runners){			
			game.runnerMoves(runnerID);
		}
		for (let dealerID of game.config.runnerQueue){
			if (game.config.staff.runners < 1){
				continue;
			}
			game.sendRunner(dealerID);
		}


		game.copWander();
		if (game.isDealerNearby(game.config.cop.x, game.config.cop.y)){
			game.arrest();
		}
		if (game.isThereARunnerHere(game.config.cop.x, game.config.cop.y) && randNum(1, 2) == 1){
			game.arrestRunner();
		}
		ui.refresh();
	}

	move(addictID, x, y){
		let addict = this.config.addicts[addictID];
		this.config.board[addict.x][addict.y] --;
		this.config.board[x][y] ++;
		this.config.addicts[addictID].x = x;
		this.config.addicts[addictID].y = y;
		if (this.config.addicts[addictID].justCopped != null){
			this.config.addicts[addictID].justCopped --;
		}
		if (this.config.addicts[addictID].justCopped == 0){
			this.config.addicts[addictID].justCopped = null;
		}
		this.config.addicts[addictID].addiction--;
		if (this.config.addicts[addictID].addiction < 0){
			this.config.addicts[addictID].addiction = 0;
		}
	}

	runnerMoves(runnerID){
		let runner = this.config.runners[runnerID];
		let dealer = this.config.dealers[runner.dealerID];
		if (dealer == undefined){
			this.config.runners.splice(runnerID, 1);
			this.config.staff.runners++;
			return;
		}
		let xD = dealer.x - runner.x;
		let yD = dealer.y - runner.y;
		let xDelta = 0, yDelta = 0;
		if (xD > 0){
			xDelta = 1;
		} else if (xD < 0 ){
			xDelta = -1;
		}
		if (yD > 0){
			yDelta = 1;
		} else if (yD < 0 ){
			yDelta = -1;
		}
		this.config.runners[runnerID].x = runner.x + xDelta;
		this.config.runners[runnerID].y = runner.y + yDelta;
		if (this.config.runners[runnerID].x == dealer.x 
			&& this.config.runners[runnerID].y == dealer.y){
			this.config.dealers[runner.dealerID].product = runner.product;
			this.config.staff.runners++;
			this.config.runners.splice(runnerID, 1);

		}
	}

	sendRunner(dealerID){
		if (this.config.staff.runners < 1){
			if (!this.config.runnerQueue.includes(dealerID)){
				this.config.runnerQueue.push(dealerID);
			}
			
			return;
		}
		if (this.config.runnerQueue.includes(dealerID)){
			this.config.runnerQueue.splice(this.config.runnerQueue.indexOf(dealerID), 1);
		}
		this.config.staff.runners --;
		let holding = this.config.dealerCapacity;
		
		if (this.config.product < this.config.dealerCapacity ){
			holding = this.config.product;			
		}
		this.config.product -= holding;
		this.config.runners.push({dealerID: Number(dealerID), x: this.config.traphouse.x, y: this.config.traphouse.y, product: holding});
	}

	wander(addictID){
		
		let addict = this.config.addicts[addictID];
		let delta = [-1, 0, 1];
		while (1){
			let randX = addict.x + delta[randNum(0, 2)];
			let randY = addict.y + delta[randNum(0, 2)];
			
			if (randX >= 0 && randX < this.config.maxX 
				&& randY >= 0 && randY < this.config.maxY
				&& this.config.board[randX][randY] <= this.config.maxAddicts
				&& this.config.board[addict.x][addict.y] >= this.config.board[randX][randY]){
				this.move(addictID, randX, randY);
				return;
			}
		}
	}

	
	whoIsHere(x, y){
		let n = 0; 
		let addicted = 0;
		for (let i in this.config.addicts){
			let addict = this.config.addicts[i];
			if (addict.x != x && addict.y != y){
				continue;
			}
			n ++;
			if (addict.addiction == 0){
				addicted ++;
			}
		}

		return addicted / n;
	}
}
