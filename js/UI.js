class UI{
	mode = 'profit';
	modes = ['profit', 'conflict', 'heat'];
	constructor(){

	}
	refresh(){		
		this.printBoard();
		this.printDealers();
		$("#money").html("$" + game.config.money.toLocaleString());
		$("#product").html(game.config.product.toLocaleString());
		$("#dealers").html(game.config.staff.dealers);
		$("#runners").html(game.config.staff.runners);
		for (let i in game.config.costs){
			
			let quantity = game.config.costs[i];
			$("#costs-" + i).html("-$" + quantity.toLocaleString());

			$("#buy-" + i).prop('disabled', false);
			if (game.config.money < quantity){
				$("#buy-" + i).prop('disabled', true);
			}
		}
		$("#capacity-runner").html(game.config.runnerCapacity.toLocaleString());
		$("#capacity-dealer").html(game.config.dealerCapacity.toLocaleString());
	}

	printBoard(){
		let txt = "";
		for (let y = 0; y < game.config.maxY; y++){
			txt += "<div class='horizontal'>";
			for (let x = 0; x < game.config.maxX; x++){
				let boxClass = '';
				let who = game.whoIsHere(x, y);				
				if (game.config.cop.x == x && game.config.cop.y == y){
					boxClass = ' cop ';
				} else if (x == game.config.traphouse.x 
					&& y == game.config.traphouse.y){
					boxClass = ' traphouse ';
				} else if (game.isThereADealerHere(x, y)){
					boxClass = ' dealer ';
				} else if (game.isThereARunnerHere(x, y)){
					boxClass = ' runner ';
				} else if (who == 0 || game.config.board[x][y] == 0){
					boxClass = ' sober ';
				}
				txt += "<span id='box-" + x + "-" + y + "' class='box " 
					+ boxClass + "'>" + game.config.board[x][y] + "</span>";
			}
			txt += "</div>";
		}
		$("#board").html(txt);
	}

	printDealers(){
		let txt = '';
		for (let i in game.config.dealers){
			let dealer = game.config.dealers[i];
			txt += "<div class=''>(" + dealer.x + ", " + dealer.y + ") - " + dealer.product;			
		}
		$("#dealerListing").html(txt);
	}
}
