		firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					var userId = user.uid;
					if (user.photoURL != null){
						$("#fotoperfil2").attr("src", user.photoURL);
					}
					var perfil = firebase.database().ref('users/' + userId + '/informacoesbasica').once('value').then(function(snapshot) {
						var dados = snapshot.val();
						$("#apelido").html(user.displayName + "<small>" + dados.primeironome + " " + dados.ultimonome + "</small>");
						$("#registrou").html("<i class='mdi mdi-checkbox-marked-circle'></i>" + dados.registrou);
						$("#idade").html("<i class='mdi mdi-cake-variant'></i>" + dados.idade + " Anos");
						$("#cidade-estado").html("<i class='mdi mdi-city'></i>" + dados.cidade + ", " + dados.estado);
					});
					document.getElementById('atualizarfotoperfil').addEventListener('change', fotoupload, false);
				}
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
					location.reload();
				}, function(error) {
					notificacao(error, '-light');
					 return;
				});
			  }).catch(function(error) {
				// [START onfailure]
				notificacao(error, '-light');
				// [END onfailure]
			  });
		}