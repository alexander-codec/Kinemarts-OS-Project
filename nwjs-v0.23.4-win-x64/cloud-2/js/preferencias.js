firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var user = firebase.auth().currentUser;
		var userId = user.uid
		var preferencia = firebase.database().ref('users/' + user.uid + '/preferencias').once('value').then(function(snapshot) {
			var dados = snapshot.val();
					if( dados != null){
						if( dados.assistente == 1){
							$('#toggle-assistente').prop('checked', true);
						}
						if( dados.log == 1){
							$('#toggle-log').prop('checked', true);
						}
						if( dados.notificacao == 1){
							$('#toggle-notificacao').prop('checked', true);
						}
					}
		});
	}
});
$('#toggle-assistente').change(function() {
	var user = firebase.auth().currentUser;
	var userId = user.uid
	if($(this).is(":checked")) {
			firebase.database().ref('users/' + userId + '/preferencias').update({
					assistente: "1"
			});
			ativarassistente();
			notificacao('Você ativou sua assistente pessoal', '-light');
			return;
	}
	firebase.database().ref('users/' + userId + '/preferencias').update({
			assistente: null
	});
	inteligencia.abort();
	notificacao('Você desativou sua assistente pessoal', '-light');
});
$('#toggle-log').change(function() {
	var user = firebase.auth().currentUser;
	var userId = user.uid
	if($(this).is(":checked")) {
		firebase.database().ref('users/' + userId + '/preferencias').update({
				log: "1"
		});
		notificacao('Você ativou o registro de uso da sua conta', '-light');
		return;
	}
	firebase.database().ref('users/' + userId + '/preferencias').update({
			log: null
	});
	notificacao('Você desativou o registro de uso da sua conta', '-light');
});
$('#toggle-notificacao').change(function() {
	var user = firebase.auth().currentUser;
	var userId = user.uid
	if($(this).is(":checked")) {
		firebase.database().ref('users/' + userId + '/preferencias').update({
				notificacao: "1"
		});
		notificacao("Você ativou as notificações desktop");
		return;
	}
	firebase.database().ref('users/' + userId + '/preferencias').update({
			notificacao: null
	});
	notificacao('Você desativou notificações desktop', '-light');
});