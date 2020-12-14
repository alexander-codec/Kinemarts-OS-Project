$("#abrircloud").click(function() {
	setTimeout(function(){
		var gui = require("nw.gui")
		gui.Window.open('https://kinemarts.com.br/desenvolvimento/Projetos/cloud-beta-3', {  
			width: 1024,
			height: 800,
		});
	}, 2000)
});
$("#sair").click(function() {
	setTimeout(function(){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.close();
	}, 1000)
});