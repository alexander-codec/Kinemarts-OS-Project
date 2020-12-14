var config = {
    apiKey: "AIzaSyBG94b2bVOAyYolIsvO296vJfnJEaExDmk",
    authDomain: "kinemarts-ddb4e.firebaseapp.com",
    databaseURL: "https://kinemarts-ddb4e.firebaseio.com",
    projectId: "kinemarts-ddb4e",
    storageBucket: "kinemarts-ddb4e.appspot.com",
    messagingSenderId: "496325866606"
};
var logg = 1;
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
			var on = logg++;
			if(on == 1){
				var cadastro = firebase.database().ref('users/' + user.uid + '/informacoesbasica').once('value').then(function(snapshot) {
					var cadastrei = snapshot.val();
					if( cadastrei == null){
							$("#meuperfil").prop("href", "completarperfil");
					}else{
						$("#meuperfil").prop("href", "meuperfil");
						$("#preferencias").prop("href", "preferencias");
					}
				});
				if (user.photoURL != null){
					$("#fotoperfil").attr("src", user.photoURL);
				}
				console.log(JSON.stringify(user, null, '  '));
				initnotification();
				loadkey();
			}
        } else {
		  window.location.href = "/acessar?redirect=/beta/cloud/1/";
        }
});