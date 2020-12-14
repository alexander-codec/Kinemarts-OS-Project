document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});
function notificacao(message, type){
        var user = firebase.auth().currentUser;
		var userId = user.uid
		var preferencia = firebase.database().ref('users/' + user.uid + '/preferencias').once('value').then(function(snapshot) {
			var dados = snapshot.val();
					if( dados != null){
						if(dados.notificacao == 1){
							if (!Notification) {
								msgtext('Seu navegador não suporta notificações desktop', '-light');
								return;
							  }

							  if (Notification.permission !== "granted")
								Notification.requestPermission();
							  else {
								var notification = new Notification('Kinemarts', {
								  icon: 'https://cdn.kinemarts.com.br/favicons/favicon-32x32.png',
								  body: message,
								});    
							  }
						}
					}else{
							$.notify({
								message: message
							},{
								type: type,
								allow_dismiss: false,
								label: 'Cancel',
								className: 'btn-xs btn-default',
								placement: {
									from: 'bottom',
									align: 'left'
								},
								delay: 2500,
								animate: {
										enter: 'animated fadeInUp',
										exit: 'animated fadeOutDown'
								},
								offset: {
									x: 30,
									y: 30
								}
							});
					}
		});
}
// carregar historico de notificação.
function initnotification() {
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	var notification = firebase.database().ref('notification/' + userId).once('value').then(function(snapshot) {
		var notifications = snapshot.val();
		if( notifications == null){
			$( "#notificationlist" ).html( "<div class='thumbnail'><img src='img/demo/headers/sm/5.png'><div class='caption'><h4>Nenhuma notificação</h4><p>Você já leu todas suas notificações no momento</p></div></div>" );
		}else{
			firebase.database().ref('notification/' + userId).limitToLast(10).on('child_added', function(data) {
				$( "#notificationbutton" ).addClass( "active" );
				$( "#notificationlist" ).append( "<a href='" + data.val().url + "' class='list-group-item media'><div class='pull-right'><img class='avatar-img' src=" + data.val().picture + "></div><div class='media-body'><div class='list-group__heading'>" + data.val().apelido + "</div> <small class='list-group__text'>" + data.val().msg + "</small></div></a>" );
			});
		}
	});
};