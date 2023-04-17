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

	buy(id){
		if (this.config.money < this.config.costs[id]){
			return;
		}
		this.config.money -= this.config.costs[id];
		if (id == 'product'){
			this.config.product += 1000;
			return;
		}
		if (id.substring(id.length - ('Upgrade').length) == 'Upgrade'){
			this.config[id.substring(0, id.length - ('Upgrade').length) + "Capacity"] += 10;
			return;
		}
		//console.log(id + 's', this.config[id + 's'])
		this.config.staff[id + 's'] ++;
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

	buyDrugs(addictID){
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
		this.config.addicts[addictID].justCopped = this.config.justcoppedtimer;
		this.config.addicts[addictID].addiction = this.config.addictionTimer;
		this.config.money += this.config.sale;
		this.config.dealers[dealerID].product--;
		if (this.config.dealers[dealerID].product < 1 && this.config.product > 0){			
			this.sendRunner(dealerID);
		}
	}

	copWander(){
		let delta = [-1, 0, 1];
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
		
	}

	dealer(x, y){
		
		if (game.isThereADealerHere(x, y)){
			for (let i in this.config.dealers){
				if (this.config.dealers[i].x == x && this.config.dealers[i].y == y){
					this.config.dealers.splice(i, 1);
					this.config.staff.dealers ++;
					return;
				}
			}
		}
		if (this.config.staff.dealers < 1){
			return;
		}
		this.config.staff.dealers --;
		this.config.dealers.push({x: x, y: y, product: 0});
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

	looping(){
		
		for (let addictID in game.config.addicts){			
			
			let addict = game.config.addicts[addictID];
			if (addict.addiction != 0){
				game.wander(addictID);
				continue;
			}
			let nearestDealer = game.isDealerNearby(addict.x, addict.y);

			if (nearestDealer != null){
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
		game.copWander();
		if (game.isDealerNearby(game.config.cop.x, game.config.cop.y)){
			game.arrest();
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
		console.log(dealer, runner);
		if (dealer == undefined){
			this.config.runners.splice(runnerID, 1);
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
			this.config.runners.splice(runnerID, 1);

		}
	}

	sendRunner(dealerID){
		let holding = this.config.runnerCapacity;
		if (this.config.product < this.config.runnerCapacity){
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
	
}
