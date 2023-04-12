$(document).on('click', '', function(e){

})

$(document).on('click', '.box', function(e){
	game.dealer(Number(e.target.id.split('-')[1]), Number(e.target.id.split('-')[2]));
	ui.refresh();
})

$(document).on('click', '.board', function(e){
	ui.mode = e.target.id.split('-')[1];
})

$(document).on('click', 'button', function(e){
	ui.refresh()
})
