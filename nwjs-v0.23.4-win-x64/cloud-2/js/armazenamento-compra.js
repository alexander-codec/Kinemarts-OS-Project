		document.getElementById('2625').addEventListener('click', comprar2625, false);
		document.getElementById('13125').addEventListener('click', comprar13125, false);
		document.getElementById('525').addEventListener('click', comprar525, false);
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
		function comprar2625 (){
			PagSeguroLightbox({
				code: 'F4101A8369692ED994E9CF8CA77FE7C8'
				}, {
				success : function(transactionCode) {
					notificacao('Sua compra foi efetuada, aguarde administrador liberar', '-light');
					var user = firebase.auth().currentUser;
					var userId = user.uid;
					var nomealeatorio = firebase.database().ref().child('armazenamento/compras/' + userId).push().key;
					firebase.database().ref('armazenamento/compras/'  + userId + '/' + nomealeatorio).set({
						espaço: "50GB",
						data: today,
						codigotransação: transactionCode,
						userid: userId
					});
					var notificationKey = firebase.database().ref().child('notification/' + userId).push().key;
					firebase.database().ref('notification/' + userId + '/' + notificationKey).set({
						apelido: "Kinemarts",
						msg: "Você adquiriu o plano de 50GB",
						hora: today,
						url: "#",
						picture: "https://cdn.kinemarts.com.br/favicons/favicon-32x32.png"
					});
				},
				abort : function() {
					notificacao('Você cancelou sua compra', '-light');
				}
			});
		}
		function comprar13125 (){
			PagSeguroLightbox({
				code: '9AB41190EDED0001142A1F9FBD14CE9C'
				}, {
				success : function(transactionCode) {
					notificacao('Sua compra foi efetuada, aguarde administrador liberar', '-light');
					var user = firebase.auth().currentUser;
					var userId = user.uid;
					var nomealeatorio = firebase.database().ref().child('armazenamento/compras/' + userId).push().key;
					firebase.database().ref('armazenamento/compras/'  + userId + '/' + nomealeatorio).set({
						espaço: "500GB",
						data: today,
						codigotransação: transactionCode,
						userid: userId
					});
					var notificationKey = firebase.database().ref().child('notification/' + userId).push().key;
					firebase.database().ref('notification/' + userId + '/' + notificationKey).set({
						apelido: "Kinemarts",
						msg: "Você adquiriu o plano de 500GB",
						hora: today,
						url: "#",
						picture: "https://cdn.kinemarts.com.br/favicons/favicon-32x32.png"
					});
				},
				abort : function() {
					notificacao('Você cancelou sua compra', '-light');
				}
			});
		}
		function comprar525 (){
			PagSeguroLightbox({
				code: '616AFB9DF4F4C89884188FB70CABDFDF'
				}, {
				success : function(transactionCode) {
					notificacao('Sua compra foi efetuada, aguarde administrador liberar', '-light');
					var user = firebase.auth().currentUser;
					var userId = user.uid;
					var nomealeatorio = firebase.database().ref().child('armazenamento/compras/' + userId).push().key;
					firebase.database().ref('armazenamento/compras/'  + userId + '/' + nomealeatorio).set({
						espaço: "5TB",
						data: today,
						codigotransação: transactionCode,
						userid: userId
					});
					var notificationKey = firebase.database().ref().child('notification/' + userId).push().key;
					firebase.database().ref('notification/' + userId + '/' + notificationKey).set({
						apelido: "Kinemarts",
						msg: "Você adquiriu o plano de 5TB",
						hora: today,
						url: "#",
						picture: "https://cdn.kinemarts.com.br/favicons/favicon-32x32.png"
					});
				},
				abort : function() {
					notificacao('Você cancelou sua compra', '-light');
				}
			});
		}