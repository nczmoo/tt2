class Game{
	config = new Config();	
	constructor(){
		this.config.gameLoopInterval =  setInterval(this.looping, 1000);
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
			||  dealer.stock < 1){
			return;
		}
		this.config.addicts[addictID].justCopped = this.config.justcoppedtimer;
		this.config.addicts[addictID].addiction = this.config.addictionTimer;
		this.config.money += this.config.sale;
		this.config.dealers[dealerID].stock--;
		if (this.config.dealers[dealerID].stock < 1){
			console.log(dealerID);
			this.sendRunner(dealerID);
		}
	}

	copWander(){
		let delta = [-1, 0, 1];
		while (1){
			let randX = this.config.cop.x + delta[randNum(0, 2)];
			let randY = this.config.cop.y + delta[randNum(0, 2)];
			if (randX == this.config.cop.x && randY == this.config.cop.y){
				continue;
			}
			if (randX >= 0 && randX < this.config.maxX 
				&& randY >= 0 && randY < this.config.maxY){
				this.config.cop.x = randX;
				this.config.cop.y = randY;
				return;
			}
		}
	}

	dealer(x, y){
		if (game.isThereADealerHere(x, y)){
			for (let i in this.config.dealers){
				if (this.config.dealers[i].x == x && this.config.dealers[i].y == y){
					this.config.dealers.splice(i, 1);
					return;
				}
			}
		}
		this.config.dealers.push({x: x, y: y, stock: this.config.startingStock});
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
				&& this.config.dealers[i].stock > 0){
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
			console.log(game.config.runners[runnerID]);
			game.runnerMoves(runnerID);
		}
		game.copWander();
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
			this.config.dealers[runner.dealerID].stock = this.config.startingStock;
			this.config.runners.splice(runnerID, 1);
			console.log(this.config.dealers[runner.dealerID].stock);
		}
	}

	sendRunner(dealerID){
		this.config.runners.push({dealerID: Number(dealerID), x: 0, y: 0});
	}

	wander(addictID){
		
		let addict = this.config.addicts[addictID];
		let delta = [-1, 0, 1];
		while (1){
			let randX = addict.x + delta[randNum(0, 2)];
			let randY = addict.y + delta[randNum(0, 2)];
			
			if (randX >= 0 && randX < this.config.maxX 
				&& randY >= 0 && randY < this.config.maxY
				&& this.config.board[randX][randY] < 6
				&& this.config.board[addict.x][addict.y] >= this.config.board[randX][randY]){
				this.move(addictID, randX, randY);
				return;
			}
		}
	}
	
}