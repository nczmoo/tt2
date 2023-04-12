class UI{
	mode = 'profit';
	modes = ['profit', 'conflict', 'heat'];
	constructor(){

	}
	refresh(){
		console.log('refresh');
		this.printBoard();
		this.printDealers();
		$("#money").html("$" + game.config.money.toLocaleString());
	}

	printBoard(){
		let txt = "";
		for (let y = 0; y < game.config.maxY; y++){
			txt += "<div class='horizontal'>";
			for (let x = 0; x < game.config.maxX; x++){
				let boxClass = '';
				if (game.config.cop.x == x && game.config.cop.y == y){
					boxClass = ' cop ';
				} else if (x == 0 && y == 0){
					boxClass = ' traphouse ';
				} else if (game.isThereADealerHere(x, y)){
					boxClass = ' dealer ';
				} else if (game.isThereARunnerHere(x, y)){
					boxClass = ' runner ';
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
			txt += "<div class=''>(" + dealer.x + ", " + dealer.y + ") - " + dealer.stock;			
		}
		$("#dealers").html(txt);
	}
}
