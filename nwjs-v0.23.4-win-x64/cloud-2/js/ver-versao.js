firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
			var versao = firebase.database().ref('info-apps/cloud').once('value').then(function(snapshot) {
					var versao = snapshot.val();
					if( versao == null){
							//erro
					}else{
						var versaoatual = snapshot.val().versao;
						versaoconectada = "2";
						if(versaoatual > versaoconectada){
							window.location.href = "/beta/cloud/" + versaoatual + "/";
						}
						if(versaoatual < versaoconectada){
							window.location.href = "/beta/cloud/" + versaoatual + "/";
						}
					}
			});
        }
});