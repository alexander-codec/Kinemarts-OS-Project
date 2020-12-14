function salvarkeys() {
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	var keypublic = $('#pubkey').val();
	var keypriv = $('#privkey').val();
	if(keypublic != null){
		if(keypriv != null){
			firebase.database().ref('keypublic/' + userId).set({
			key: keypublic
		});
		$.cookie("chaveprivada", keypriv, { expires : 1 });
		$.cookie("chavepublica", keypublic, { expires : 1 });
		location.reload();
		}
	}
}
function loadkey() {
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	var publickey = firebase.database().ref('keypublic/' + userId).once('value').then(function(snapshot) {
		var key = snapshot.val();
		if (key == null){
			//$('#criarchaves').show();
			$( "#chatlist" ).html( "<div class='thumbnail'><img src='img/demo/headers/sm/5.png'><div class='caption'><h4>Você não criou um par de chaves</h4><p>É muito facil criar um par de chaves abaixe a extensão gerador de chave e clique (gerar nova chave) assim que baixar copie o conteudo e adicione</p><div class='pull-left'><a href='https://chrome.google.com/webstore/detail/gerador-de-chave/cebbikoojphamjligajifklakmeilbpn' target='_blank' class='btn btn-sm btn-default' role='button'>Baixar Extensão</a></div><div class='pull-right'><a id='adicionarkeysbutton' class='btn btn-sm btn-default' role='button' style='display: none;'>Adicionar Chaves</a></div></div></div>" );
			$( "#adicionarkeysbutton" ).click(function() {
				  $('#adicionarkeys').show();
				});
		}else{
			$.cookie("chavepublica", key.key, { expires : 1 });
			if($.cookie("chaveprivada") == null){
				//$('#chaveprivada').show();
				$( "#chatlist" ).html( "<div class='thumbnail'><img src='img/demo/headers/sm/5.png'><div class='caption'><h4>Sua chave privada expirou</h4><p>Adiciona sua chave privada novamente aqui para podermos descriptografar seus dados</p><a id='salvarkeyprivada' class='btn btn-sm btn-default' role='button' style='display: none;'>Adicionar Chave Privada</a></div></div>" );
				$( "#salvarkeyprivada" ).click(function() {
				  $('#adicionarkeyprivada').show();
				});
			}else{
				//loadrecentes();
			}
		}
	});
}
function salvarkeypriv() {
	var keypriv = $('#privkey').val();
	if(keypriv != null){
		$.cookie("chaveprivada", keypriv, { expires : 1 });
		location.reload();
	}
}