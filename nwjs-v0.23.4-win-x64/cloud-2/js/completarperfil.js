firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
			var cadastro = firebase.database().ref('users/' + user.uid + '/informacoesbasica').once('value').then(function(snapshot) {
					var cadastrei = snapshot.val();
					if( cadastrei != null){
							window.location.href = "meuperfil";
					}
			});
        }
});
		$(document).ready(function () {
		
			$.getJSON('js/estados_cidades.json', function (data) {
				var items = [];
				var options = '<option value="">Escolha um estado</option>';	
				$.each(data, function (key, val) {
					options += '<option value="' + val.nome + '">' + val.nome + '</option>';
				});					
				$("#estados").html(options);				
				
				$("#estados").change(function () {				
				
					var options_cidades = '';
					var str = "";					
					
					$("#estados option:selected").each(function () {
						str += $(this).text();
					});
					
					$.each(data, function (key, val) {
						if(val.nome == str) {							
							$.each(val.cidades, function (key_city, val_city) {
								options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
							});							
						}
					});
					$("#cidades").html(options_cidades);
					
				}).change();		
			
			});
			document.getElementById('salvarperfil').addEventListener('click', mesalvar, false);
			document.getElementById('foto').addEventListener('change', fotoupload, false);
		});
function fotoupload(evt) {
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	var storageRef = firebase.storage().ref();
      evt.stopPropagation();
      evt.preventDefault();
      var file = evt.target.files[0];
      var metadata = {
        'contentType': file.type
      };
	  var nomealeatorio = firebase.database().ref().child('armazenamento/fotoperfil/' + userId).push().key;
      storageRef.child('armazenamento/fotoperfil/'  + userId + '/' + nomealeatorio).put(file, metadata).then(function(snapshot) {
        var fotoperfil = snapshot.downloadURL;
		user.updateProfile({
			photoURL: fotoperfil
		}).then(function() {
			  
		}, function(error) {
			 alert('inserir foto falhou:', error);
			 return;
		});
      }).catch(function(error) {
        // [START onfailure]
        console.error('envio de foto falhou:', error);
        // [END onfailure]
      });
}
function mesalvar() {
			var user = firebase.auth().currentUser;
			var userId = user.uid;
			//Apelido
			var apelido = document.getElementById('apelido').value;
			if (apelido.length < 4) {
				alert('Insira seu Apelido.');
				return;
			}
			//Pegar dados do form
			var primeironome = document.getElementById('primeironome').value;
			var ultimonome = document.getElementById('ultimonome').value;
			var estado = document.getElementById('estados').value;
			var idade = document.getElementById('idade').value;
			var cidade = document.getElementById('cidades').value;
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1;

			var yyyy = today.getFullYear();
			if(dd<10){
				dd='0'+dd;
			} 
			if(mm<10){
				mm='0'+mm;
			} 
			var today = dd+'/'+mm+'/'+yyyy;
			//if (sexo1 == "Homem"){
			//	var sexo = "Homem";
			//}else{
			//	var sexo = "Mulher";
			//}
			//Inserir dados no cloud database
			firebase.database().ref('users/' + userId + '/informacoesbasica').set({
				primeironome: primeironome,
				ultimonome: ultimonome,
				apelido: apelido,
				registrou: today,
				estado: estado,
				idade: idade,
				cidade: cidade
			});
			//criar notificação de bem vindo
			var notificationKey = firebase.database().ref().child('notification/' + userId).push().key;
			firebase.database().ref('notification/' + userId + '/' + notificationKey).set({
				apelido: "Kinemarts",
				msg: "Você completou seu perfil",
				hora: today,
				url: "#",
				picture: "https://cdn.kinemarts.com.br/favicons/favicon-32x32.png"
			});
			user.updateProfile({
				displayName: apelido
			}).then(function() {
			  
			}, function(error) {
			  alert('Ocorreu um erro');
			  return;
			});
			var cadastro = firebase.database().ref('users/' + userId + '/informacoesbasica').once('value').then(function(snapshot) {
				var cadastrei = snapshot.val();
				if( cadastrei.primeironome == primeironome){
					window.location.href = "index";
				}
			});
}