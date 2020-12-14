// copiar para area de transferencia
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  textArea.style.width = '2em';
  textArea.style.height = '2em';

  textArea.style.padding = 0;

  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
  } catch (err) {
  }

  document.body.removeChild(textArea);
}
// informações da hora
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
//informacoes do tamanho do arquivo
function informacaotamanho(bytes, si) {
								var thresh = si ? 1000 : 1024;
								if(Math.abs(bytes) < thresh) {
									return bytes + ' B';
								}
								var units = si
									? ['kB','MB','GB','TB','PB','EB','ZB','YB']
									: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
								var u = -1;
								do {
									bytes /= thresh;
									++u;
								} while(Math.abs(bytes) >= thresh && u < units.length - 1);
								return bytes.toFixed(1)+' '+units[u];
}
// carregar dados dos arquivos e pasta do usuario
var x = 1;
firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
			var xx = x++;
			if(xx == 1){
				funcaorecarregararquivodousuario();
				funcaorecarregarpastadousuario();
				recarregarinformacoesdoarmazenamento();
			}
		}
})
//adicionar pasta ao cloud
$('#novapasta').click(function(){
        swal({
            title: "Qual nome da pasta?",
            html:
				'<input type="text" class="form-control" id="nomenovapasta" placeholder="Digite o nome da pasta aqui">',
            type: "question",
            showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: '<i class="mdi mdi-folder-plus"></i> Criar Pasta',
			cancelButtonText: 'Cancelar'
        }).then(function () {
			var nome = document.getElementById('nomenovapasta').value;
			var user = firebase.auth().currentUser;
			var userId = user.uid;
			var pastakey = firebase.database().ref().child('armazenamento/pastas/' + userId).push().key;
			firebase.database().ref('armazenamento/pastas/' + userId + '/' + pastakey).set({
				nome: nome,
				id: pastakey,
				criado: today,
				descricao: "false",
				compartilhado: "false"
			});
			  swal(
				'Pasta Criada',
				'Elá ja se encontra no seu cloud',
				'success'
			  )
			  $( "#list-pastas" ).html("");
			  funcaorecarregarpastadousuario();
		}, function (dismiss) {
		  // dismiss can be 'cancel', 'overlay',
		  // 'close', and 'timer'
		  if (dismiss === 'cancel') {
			swal(
			  'Você Cancelou',
			  'Sua pasta não foi criada',
			  'error'
			)
		  }
		});
});
function recarregarinformacoesdoarmazenamento() {
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoadquirido').once('value').then(function(snapshot) {
		var informacoesdoarmazenamento = snapshot.val();
			if(informacoesdoarmazenamento == null){
				window.location.href = "/cloud/armazenamento";
			}else{
				// espaço adquirido pelo usuario (somente para informar usuario do espaço que ele adquiriu)
				var adquirido = snapshot.val().adquirido;
				var txtadquirido = informacaotamanho(adquirido,true);
				$('#adquirido').text(txtadquirido);
					
				//somente para saber quanto esta sendo usado no momento
				firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
					var emuso = snapshot.val().emuso;
					var txtusado = informacaotamanho(emuso,true);
					$('#usado').text(txtusado);
							
					//para informar usuario de quanto espaço disponivel ele ainda tem
					firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçorestante').once('value').then(function(snapshot) {
						var restante = snapshot.val().restante;
						var txtrestante = informacaotamanho(restante,true);
						$('#restante').text(txtrestante);
						var disponivel = (restante-emuso);
						var txtdisponivel = informacaotamanho(disponivel,true);
						$('#disponivel').text(txtdisponivel);
					});
				});
			}
	});
};
// mostrar as informacoes do arquivo
function infofile(item){
	var id = $(item).attr( "data-item-id" );
	var nome = $(item).attr( "data-item-nome" );
	var tipo = $(item).attr( "data-item-tipo" );
	var criado = $(item).attr( "data-item-criado" );
	var enviado = $(item).attr( "data-item-enviado" );
	var infosize = $(item).attr( "data-item-tamanho" );
	var tamanho = informacaotamanho(infosize,true);
	var icone = $(item).attr( "data-item-icon" );
	var imagem = $(item).attr( "data-item-imagem" );
	var compartilhado = $(item).attr( "data-item-compartilhado" );
	var descricao = $(item).attr( "data-item-descricao" );
	// limpar item list
	$('#titulo').text(nome);
	$('#item-details').html("");
	$('#item-details').append("<li><span class='title'>Tipo</span><span class='info'>" + tipo + "</span></li>");
	$('#item-details').append("<li><span class='title'>Criado</span><span class='info'>" + criado + "</span></li>");
	$('#item-details').append("<li><span class='title'>Enviado</span><span class='info'>" + enviado + "</span></li>");
	$('#item-details').append("<li><span class='title'>Tamanho</span><span class='info'>" + tamanho + "</span></li>");
	$('#item-descricao').html("<button id='adddescricaofile' class='btn btn-default btn-block' disabled><i class='mdi mdi-border-color'></i> Adicionar descrição</button>");
	document.getElementById("adddescricaofile").addEventListener("click", function() {funcaoadddescricaofile(id);}, false);
	$('#current-img').html("<img src='" + imagem + "'>");
	$('#icone').addClass("mdi-" + icone +"");
	$('#icone').removeClass("md-text-amber");
	if( compartilhado == "true"){
		$('#toggle-compartilhado').prop('checked', true);
	}
	if( descricao != "Nenhuma descrição até o momento"){
		$('#item-descricao').html("<li><span class='title'>" + descricao + "</span></li>");
	}
}
// mostrar informacoes da pasta escolhida
function infopasta(item){
	var id = $(item).attr( "data-item-id" );
	var nome = $(item).attr( "data-item-nome" );
	var descricao = $(item).attr( "data-item-descricao" );
	var criado = $(item).attr( "data-item-criado" );
	var modificado = $(item).attr( "data-item-modificado" );
	var aberto = $(item).attr( "data-item-aberto" );
	if (aberto == "undefined"){
		var aberto = "Nunca Aberta";
	}
	if (modificado == "undefined"){
		var modificado = "Nunca Modificada";
	}
	var compartilhado = $(item).attr( "data-item-compartilhado" );
	$('#titulo').text(nome);
	$('#item-details').html("");
	$('#item-details').append("<li><span class='title'>Tipo</span><span class='info'>Pasta</span></li>");
	$('#item-details').append("<li><span class='title'>Criado</span><span class='info'>" + criado + "</span></li>");
	$('#item-details').append("<li><span class='title'>Modificada</span><span class='info'>" + modificado + "</span></li>");
	$('#item-details').append("<li><span class='title'>Aberta</span><span class='info'>" + aberto + "</span></li>");
	$('#current-img').html("<i class='mdi mdi-folder md-text-amber'></i>");
	$('#item-descricao').html("<button id='deletarpasta' class='btn btn-danger btn-block' disabled><i class='mdi mdi-delete'></i> Deletar esta Pasta</button><button id='adddescricaopasta' class='btn btn-default btn-block' disabled><i class='mdi mdi-border-color'></i> Adicionar descrição</button>");
	document.getElementById("deletarpasta").addEventListener("click", function() {funcaoexcluirpasta(id);}, false);
	document.getElementById("adddescricaopasta").addEventListener("click", function() {funcaoadddescricaopasta(id);}, false);
	$('#icone').addClass("mdi-folder md-text-amber");
	if( compartilhado == "true"){
		$('#toggle-compartilhado').prop('checked', true);
	}
	if( descricao != "false"){
		$('#item-descricao').append("<li><span class='title'>" + descricao + "</span></li>");
	}
}
// funcoes do menu de contexto
(function() {
"use strict";
  function clickInsideElement( e, className ) {
    var el = e.srcElement || e.target;
    
    if ( el.classList.contains(className) ) {
      return el;
    } else {
      while ( el = el.parentNode ) {
        if ( el.classList && el.classList.contains(className) ) {
          return el;
        }
      }
    }

    return false;
  }
  function getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;
    
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    }
  }
  var contextMenuClassName = "context-menu";
  var contextMenuItemClassName = "context-menu__item";
  var contextMenuLinkClassName = "context-menu__link";
  var contextMenuActive = "context-menu--active";

  var taskItemClassName = "task";
  var taskItemInContext;

  var clickCoords;
  var clickCoordsX;
  var clickCoordsY;
  var menu = document.querySelector("#context-menu");
  var menuItems = menu.querySelectorAll(".context-menu__item");
  var menuState = 0;
  var menuWidth;
  var menuHeight;
  var menuPosition;
  var menuPositionX;
  var menuPositionY;
  var windowWidth;
  var windowHeight;
  function init() {
    contextListener();
    clickListener();
    keyupListener();
    resizeListener();
  }
  function contextListener() {
    document.addEventListener( "contextmenu", function(e) {
      taskItemInContext = clickInsideElement( e, taskItemClassName );

      if ( taskItemInContext ) {
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
      } else {
        taskItemInContext = null;
        toggleMenuOff();
      }
    });
  }
  function clickListener() {
    document.addEventListener( "click", function(e) {
      var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );

      if ( clickeElIsLink ) {
        e.preventDefault();
        menuItemListener( clickeElIsLink );
      } else {
        var button = e.which || e.button;
        if ( button === 1 ) {
          toggleMenuOff();
        }
      }
    });
  }
  function keyupListener() {
    window.onkeyup = function(e) {
      if ( e.keyCode === 27 ) {
        toggleMenuOff();
      }
    }
  }
  function resizeListener() {
    window.onresize = function(e) {
      toggleMenuOff();
    };
  }
  function toggleMenuOn() {
    if ( menuState !== 1 ) {
      menuState = 1;
      menu.classList.add( contextMenuActive );
    }
  }
  function toggleMenuOff() {
    if ( menuState !== 0 ) {
      menuState = 0;
      menu.classList.remove( contextMenuActive );
    }
  }
  function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ( (windowWidth - clickCoordsX) < menuWidth ) {
      menu.style.left = windowWidth - menuWidth + "px";
    } else {
      menu.style.left = clickCoordsX + "px";
    }

    if ( (windowHeight - clickCoordsY) < menuHeight ) {
      menu.style.top = windowHeight - menuHeight + "px";
    } else {
      menu.style.top = clickCoordsY + "px";
    }
  }
  function menuItemListener( link ) {
	if( link.getAttribute("data-action") == "copiarlinkdireto"){
		var linkdireto = taskItemInContext.getAttribute("data-item-link-direto");
		copyTextToClipboard(linkdireto);
		notificacao('Seu Link Direto foi copiado com sucesso', '-light');
	}
	if( link.getAttribute("data-action") == "baixar"){
		var linkdireto = taskItemInContext.getAttribute("data-item-link-direto");
		var xnome = taskItemInContext.getAttribute("data-item-nome");
		var tipo = taskItemInContext.getAttribute("data-item-tipo");
		if(tipo == "image/jpeg"){
			notificacao('Seu arquivo está baixando...', '-light');
			var Nome = xnome + ".jpeg";
			downloadFile(linkdireto, Nome);
		}
		if(tipo == "image/png"){
			notificacao('Seu arquivo está baixando...', '-light');
			var Nome = xnome + ".png";
			downloadFile(linkdireto, Nome);
		}
		if(tipo == "audio/mp3"){
			notificacao('Seu arquivo está baixando...', '-light');
			var nome = xnome + ".mp3";
			downloadFile(linkdireto, nome);
		}
		if(tipo == "video/mp4"){
			notificacao('Seu arquivo está baixando...', '-light');
			var Nome = xnome + ".mp4";
			downloadFile(linkdireto, Nome);
		}
		if(tipo == "video/x-matroska"){
			notificacao('Seu arquivo está baixando...', '-light');
			var Nome = xnome + ".mkv";
			downloadFile(linkdireto, Nome);
		}
	}
	if( link.getAttribute("data-action") == "mover"){
		swal({
            title: "Mover Para",
            html:
				'<div class="form-group"><select id="pastadedestino"></select></div>',
            type: "question",
            showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Mover',
			cancelButtonText: 'Cancelar'
        }).then(function () {
			var moverpara = document.getElementById('pastadedestino').value;
			var user = firebase.auth().currentUser;
			var userId = user.uid;
			var id = taskItemInContext.getAttribute("data-item-id");
			firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + id).once('value').then(function(snapshot) {
					var nomealeatorio = firebase.database().ref().child('armazenamento/arquivos/'  + userId + '/pastas/' + moverpara).push().key;
					firebase.database().ref('armazenamento/pastas/'  + userId + '/' + moverpara + '/arquivos/' + nomealeatorio).set({
												nome: snapshot.val().nome,
												linkdireto: snapshot.val().linkdireto,
												criado: snapshot.val().criado,
												enviado: snapshot.val().enviado,
												tipo: snapshot.val().tipo,
												thumbnail: snapshot.val().thumbnail,
												id: nomealeatorio,
												tamanho: snapshot.val().tamanho,
												icone: snapshot.val().icone,
												compartilhado: snapshot.val().compartilhado
					});
				
			});
			firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + id).remove();
			firebase.database().ref('armazenamento/pastas/' + userId + '/' + moverpara).update({
				modificado: today
			});
			  swal(
				'Arquivo Movido',
				'O local do arquivo já foi alterado no seu cloud',
				'success'
			  )
			  funcaorecarregararquivodousuario();
		}, function (dismiss) {
		  // dismiss can be 'cancel', 'overlay',
		  // 'close', and 'timer'
		  if (dismiss === 'cancel') {
			swal(
			  'Você Cancelou',
			  'Seu arquivo não foi movido',
			  'error'
			)
		  }
		});
		var user = firebase.auth().currentUser;
		var userId = user.uid;
		var checarpasta = firebase.database().ref('armazenamento/pastas/' + userId).once('value').then(function(snapshot) {
				var checarpasta = snapshot.val();
				if( checarpasta != null){
					firebase.database().ref('armazenamento/pastas/' + userId).on('child_added', function(data) {
						$( "#pastadedestino" ).append("<option value=" + data.val().id + ">" + data.val().nome + "</option>");
					});
				}else{
					swal(
						'Você não tem Pastas',
						'Crie uma pasta para mover seus arquivos',
						'error'
					)
				}
		});
	}
	if( link.getAttribute("data-action") == "moverdapasta"){
		notificacao('Ainda não disponivel', '-light');
	}
	if( link.getAttribute("data-action") == "incorporar"){
		var linkdireto = taskItemInContext.getAttribute("data-item-link-direto");
		var tipo = taskItemInContext.getAttribute("data-item-icon");
		if(tipo == "image"){
			var code1 = "<img src='";
			var code3 = "'>";
			var codigoincorporar = code1 + linkdireto + code3;
		}
		if(tipo == "image"){
			var code1 = "<img src='";
			var code3 = "'>";
			var codigoincorporar = code1 + linkdireto + code3;
		}
		if(tipo == "music"){
			var code1 = "<audio controls><source src='";
			var code3 = "' type='audio/mpeg'></audio>";
			var codigoincorporar = code1 + linkdireto + code3;
		}
		if(tipo == "video"){
			var code1 = "<video width='100%' height='100%' controls><source src='";
			var code3 = "' type='video/mp4'></video>";
			var codigoincorporar = code1 + linkdireto + code3;
		}
		if(tipo == "video"){
			var code1 = "<video width='100%' height='100%' controls><source src='";
			var code3 = "' type='video/mp4'></video>";
			var codigoincorporar = code1 + linkdireto + code3;
		}
		copyTextToClipboard(codigoincorporar);
		notificacao('Incoporar foi criado com sucesso', '-light');
	}
	if( link.getAttribute("data-action") == "mudarcor"){
		notificacao('Ainda não disponivel', '-light');
	}
	if( link.getAttribute("data-action") == "renomear"){
		swal({
            title: "Qual novo nome?",
            html:
				'<input type="text" class="form-control" id="novonome" placeholder="Digite o novo nome aqui">',
            type: "question",
            showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: '<i class="mdi mdi-border-color"></i> Alterar Nome',
			cancelButtonText: 'Cancelar'
        }).then(function () {
			var nome = document.getElementById('novonome').value;
			var user = firebase.auth().currentUser;
			var userId = user.uid;
			var id = taskItemInContext.getAttribute("data-item-id");
			firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + id).update({
				nome: nome
			});
			  swal(
				'Nome Alterado',
				'O novo nome já foi alterado no seu cloud',
				'success'
			  )
			 funcaorecarregararquivodousuario();
		}, function (dismiss) {
		  // dismiss can be 'cancel', 'overlay',
		  // 'close', and 'timer'
		  if (dismiss === 'cancel') {
			swal(
			  'Você Cancelou',
			  'Seu arquivo não foi alterado',
			  'error'
			)
		  }
		});
	}
	if( link.getAttribute("data-action") == "renomeardapasta"){
		swal({
            title: "Qual novo nome?",
            html:
				'<input type="text" class="form-control" id="novonome" placeholder="Digite o novo nome aqui">',
            type: "question",
            showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: '<i class="mdi mdi-border-color"></i> Alterar Nome',
			cancelButtonText: 'Cancelar'
        }).then(function () {
			var nome = document.getElementById('novonome').value;
			var user = firebase.auth().currentUser;
			var userId = user.uid;
			var id = taskItemInContext.getAttribute("data-item-id");
			var pastaid = taskItemInContext.getAttribute("data-item-pastaid");
			var pastanome = taskItemInContext.getAttribute("data-item-pastanome");
			firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + id).update({
				nome: nome
			});
			  swal(
				'Nome Alterado',
				'O novo nome já foi alterado no seu cloud',
				'success'
			  )
			funcaorecarregararquivodapasta(pastaid, pastanome);
		}, function (dismiss) {
		  // dismiss can be 'cancel', 'overlay',
		  // 'close', and 'timer'
		  if (dismiss === 'cancel') {
			swal(
			  'Você Cancelou',
			  'Seu arquivo não foi alterado',
			  'error'
			)
		  }
		});
	}
	if( link.getAttribute("data-action") == "deletar"){
		var tipo = taskItemInContext.getAttribute("data-item-tipo");
		var user = firebase.auth().currentUser;
		var userId = user.uid;
		var storageRef = firebase.storage().ref();
		var id = taskItemInContext.getAttribute("data-item-id");
		if(tipo == "image/jpeg" || tipo == "image/png"){
			var deletar = storageRef.child('armazenamento/arquivos/'  + userId + '/imagens/' + id);
			deletar.delete().then(function() {
				firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + id).once('value').then(function(snapshot) {
					var tamanhodoarquivo = snapshot.val().tamanho;
						firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
													var usado = snapshot.val().emuso;
													var novoarmazenamento = usado - tamanhodoarquivo;
													firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').set({
														emuso: novoarmazenamento
													});
													recarregarinformacoesdoarmazenamento();
						});
				});
				firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + id).remove();
				notificacao('Arquivo foi excluido', '-light');
				funcaorecarregararquivodousuario();
			}).catch(function(error) {
			  notificacao('Erro ao excluir arquivo', '-light');
			});
			
		}
		if(tipo == "audio/mp3"){
			var deletar = storageRef.child('armazenamento/arquivos/'  + userId + '/audios/' + id);
			deletar.delete().then(function() {
				firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + id).once('value').then(function(snapshot) {
					var tamanhodoarquivo = snapshot.val().tamanho;
						firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
													var usado = snapshot.val().emuso;
													var novoarmazenamento = usado - tamanhodoarquivo;
													firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').set({
														emuso: novoarmazenamento
													});
													recarregarinformacoesdoarmazenamento();
						});
				});
				firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + id).remove();
				notificacao('Arquivo foi excluido', '-light');
				funcaorecarregararquivodousuario();
			}).catch(function(error) {
			  notificacao('Erro ao excluir arquivo', '-light');
			});
		}
		if(tipo == "video/mp4" || tipo == "video/x-matroska"){
			var deletar = storageRef.child('armazenamento/arquivos/'  + userId + '/videos/' + id);
			deletar.delete().then(function() {
				firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + id).once('value').then(function(snapshot) {
					var tamanhodoarquivo = snapshot.val().tamanho;
						firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
													var usado = snapshot.val().emuso;
													var novoarmazenamento = usado - tamanhodoarquivo;
													firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').set({
														emuso: novoarmazenamento
													});
													recarregarinformacoesdoarmazenamento();
						});
				});
				firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + id).remove();
				notificacao('Arquivo foi excluido', '-light');
				funcaorecarregararquivodousuario();
			}).catch(function(error) {
			  notificacao('Erro ao excluir arquivo', '-light');
			});
		}
	}
	if( link.getAttribute("data-action") == "deletardapasta"){
		var tipo = taskItemInContext.getAttribute("data-item-tipo");
		var pastaid = taskItemInContext.getAttribute("data-item-pastaid");
		var user = firebase.auth().currentUser;
		var userId = user.uid;
		var storageRef = firebase.storage().ref();
		var id = taskItemInContext.getAttribute("data-item-id");
		var nome = taskItemInContext.getAttribute("data-item-pastanome");
		if(tipo == "image/jpeg" || tipo == "image/png"){
			var deletar = storageRef.child('armazenamento/arquivos/'  + userId + '/imagens/' + id);
			deletar.delete().then(function() {
			  firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + id).once('value').then(function(snapshot) {
					var tamanhodoarquivo = snapshot.val().tamanho;
						firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
													var usado = snapshot.val().emuso;
													var novoarmazenamento = usado - tamanhodoarquivo;
													firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').set({
														emuso: novoarmazenamento
													});
													recarregarinformacoesdoarmazenamento();
						});
				});
				firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + id).remove();
				notificacao('Arquivo foi excluido', '-light');
				funcaorecarregararquivodapasta(pastaid, nome);
			}).catch(function(error) {
			  notificacao('Erro ao excluir arquivo', '-light');
			});
			
		}
		if(tipo == "audio/mp3"){
			var deletar = storageRef.child('armazenamento/arquivos/'  + userId + '/audios/' + id);
			deletar.delete().then(function() {
			  firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + id).once('value').then(function(snapshot) {
					var tamanhodoarquivo = snapshot.val().tamanho;
						firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
													var usado = snapshot.val().emuso;
													var novoarmazenamento = usado - tamanhodoarquivo;
													firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').set({
														emuso: novoarmazenamento
													});
													recarregarinformacoesdoarmazenamento();
						});
				});
				firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + id).remove();
				notificacao('Arquivo foi excluido', '-light');
				funcaorecarregararquivodapasta(pastaid, nome);
			}).catch(function(error) {
			  notificacao('Erro ao excluir arquivo', '-light');
			});
		}
		if(tipo == "video/mp4" || tipo == "video/x-matroska"){
			var deletar = storageRef.child('armazenamento/arquivos/'  + userId + '/videos/' + id);
			deletar.delete().then(function() {
				firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + id).once('value').then(function(snapshot) {
					var tamanhodoarquivo = snapshot.val().tamanho;
						firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
													var usado = snapshot.val().emuso;
													var novoarmazenamento = usado - tamanhodoarquivo;
													firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').set({
														emuso: novoarmazenamento
													});
													recarregarinformacoesdoarmazenamento();
						});
				});
				firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + id).remove();
				notificacao('Arquivo foi excluido', '-light');
				funcaorecarregararquivodapasta(pastaid, nome);
			}).catch(function(error) {
			  notificacao('Erro ao excluir arquivo', '-light');
			});
		}
	}
	
	// fim do menu
    toggleMenuOff();
  }
  init();

})();
function funcaorecarregarpastadousuario(){
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	$('#txtpastas').text("");
	$('#list-pastas').html("");
	var versetempasta = firebase.database().ref('armazenamento/pastas/'  + userId).once('value').then(function(snapshot) {
		var versetempasta = snapshot.val();
			if( versetempasta != null){
				firebase.database().ref('armazenamento/pastas/'  + userId).on('child_added', function(data) {
					$('#txtpastas').text("Pastas");
					$( "#list-pastas" ).append( "<li><div class='card card-folder card-item enable-context-menu'><div class='card-heading'><i class='mdi mdi-folder'></i></div><div class='card-body' onclick='funcaoabrirpasta(this)' data-item-nome='" + data.val().nome + "' data-item-id='" + data.val().id + "'><span class='title'>" + data.val().nome + "</span></div><div onclick='infopasta(this)' class='card-footer' data-item-modificado='" + data.val().modificado + "' data-item-aberto='" + data.val().aberto + "' data-item-criado='" + data.val().criado + "' data-item-compartilhado='" + data.val().compartilhado + "' data-item-descricao='" + data.val().descricao + "' data-item-nome='" + data.val().nome + "' data-item-id='" + data.val().id + "'><i class='mdi mdi-information-outline' data-mae-action='block-open' data-mae-target='.messages__sidebar'></i></div></div></li>" );
				});
			}
	});
}
function funcaorecarregararquivodousuario(){
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	$('#list-arquivos').html("");
	$('#txtarquivos-pasta').text("");
	var versejatemarquivos = firebase.database().ref('armazenamento/arquivos/'  + userId).once('value').then(function(snapshot) {
		var versejatemarquivos = snapshot.val();
			if( versejatemarquivos != null){
				firebase.database().ref('armazenamento/arquivos/'  + userId).on('child_added', function(data) {
					$('#txtarquivos-pasta').text("Arquivos");
					$( "#list-arquivos" ).append( "<li><div onclick='infofile(this)' data-mae-action='block-open' data-mae-target='.messages__sidebar' class='mdl-card mdl-shadow--2dp demo-card-square task' data-item-tipo='" + data.val().tipo + "' data-item-tamanho='" + data.val().tamanho + "' data-item-link-direto='" + data.val().linkdireto + "' data-item-nome='" + data.val().nome + "' data-item-criado='" + data.val().criado + "' data-item-descricao='" + data.val().descricao + "' data-item-enviado='" + data.val().enviado + "' data-item-id='" + data.val().id + "' data-item-icon='" + data.val().icone + "' data-item-compartilhado='" + data.val().compartilhado + "' data-item-imagem='" + data.val().thumbnail + "'><div class='mdl-card__title mdl-card--expand' style='background-image: url(" + data.val().thumbnail + ");'><h2 class='mdl-card__title-text'>" + data.val().nome + "</h2></div><div class='mdl-card__supporting-text'>" + data.val().descricao + "</div></div></li>" );
					document.getElementById('enviararquivo').addEventListener('change', funcaoenviararquivocloudprincipal, false);
				});
			}else{
				$('#list-arquivos').html("<div class='card text-center'><div class='card-block fileupload'><h4 class='card-title'>Nenhum Arquivo foi encontrado</h4><p class='card-text'>Envie seus arquivos usando o botão adicionar</p></div></div>");
				document.getElementById('enviararquivo').addEventListener('change', funcaoenviararquivocloudprincipal, false);
			}
	});
}
function funcaorecarregararquivodapasta(pastaid, nome) {
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	$('#list-arquivos').html("");
	firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos').once('value').then(function(snapshot) {
	var checararquivos = snapshot.val();
		if( checararquivos != null){
			$('#txtarquivos-pasta').text(nome);
			firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos').on('child_added', function(data) {
				$( "#list-arquivos" ).append( "<li><div onclick='infofile(this)' data-mae-action='block-open' data-mae-target='.messages__sidebar' class='mdl-card mdl-shadow--2dp demo-card-square task' data-item-tipo='" + data.val().tipo + "' data-item-tamanho='" + data.val().tamanho + "' data-item-link-direto='" + data.val().linkdireto + "' data-item-pastaid='" + pastaid + "' data-item-pastanome='" + nome + "' data-item-descricao='" + data.val().descricao + "' data-item-nome='" + data.val().nome + "' data-item-criado='" + data.val().criado + "' data-item-enviado='" + data.val().enviado + "' data-item-id='" + data.val().id + "' data-item-icon='" + data.val().icone + "' data-item-compartilhado='" + data.val().compartilhado + "' data-item-imagem='" + data.val().thumbnail + "'><div class='mdl-card__title mdl-card--expand' style='background-image: url(" + data.val().thumbnail + ");'><h2 class='mdl-card__title-text'>" + data.val().nome + "</h2></div><div class='mdl-card__supporting-text'>Nenhuma descrição até o momento</div></div></li>" );
			});
			}else{
				$('#list-arquivos').html("<div class='card text-center'><div class='card-block fileupload'><h4 class='card-title'>Nenhum Arquivo foi encontrado</h4><p class='card-text'>Envie seus arquivos usando o botão abaixo</p><button type='button' class='btn btn-primary btn-adcionar btn--icon-text'><input id='addarquivopasta' type='file' class='upload inputfile' accept='.jpg, .png, .mp4, .mkv' /><i class='mdi mdi-cloud-upload'></i> Enviar Arquivo</button></div></div>");
			}
	});
};
function funcaoenviararquivocloudprincipal(evt){
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	$.each($('#enviararquivo').prop("files"), function(k,v){
				var filename = v['name'];
	});
	evt.stopPropagation();
    evt.preventDefault();
    var file = evt.target.files[0];
    var metadata = {
       'contentType': file.type
    };
	var x = file.name;
	var nomedoarquivo = x.substring(0, x.lastIndexOf('.'));
	var cloudprincipal = firebase.storage().ref();
	var tamanhodoarquivodoupload = file.size;
	if(file.type == "image/jpeg" || file.type == "image/png" || file.type == "audio/mp3" || file.type == "video/mp4" || file.type == "video/x-matroska"){
		// enviar arquivo de imagem
		if(file.type == "image/jpeg" || file.type == "image/png"){
			firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
				var emuso = snapshot.val().emuso;
				firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçorestante').once('value').then(function(snapshot) {
					var restante = snapshot.val().restante;
					var espaçodisponivel = (restante-emuso);
					if(espaçodisponivel > tamanhodoarquivodoupload){
						var nomealeatorio = firebase.database().ref().child('armazenamento/arquivos/' + userId).push().key;
						var progress = 0;
						$('#tarefaslist').append("<div id='" + nomealeatorio + "' class='list-group-item'><div class='list-group__heading m-b-5'>Enviando " + file.name + "</div><div class='progress'><div id='progress" + nomealeatorio + "' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style=''></div></div><p id='velocidade-" + nomealeatorio + "'></p></div>");
						$( "#taskbutton" ).addClass( "active" );
						var uploadimagemtask = cloudprincipal.child('armazenamento/arquivos/'  + userId + '/imagens/' + nomealeatorio).put(file, metadata);
						// enviando arquivo
										uploadimagemtask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
										  function(snapshot) {
											var progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
											var txtprogress = (progress + "%");
											var progressid = "#progress" + nomealeatorio;
											$( progressid ).css( "width", txtprogress);
											var velocidadeid = "#velocidade-" + nomealeatorio;
											$( velocidadeid ).text(informacaotamanho(snapshot.bytesTransferred,true) + " / " + informacaotamanho(snapshot.totalBytes,true));
											
											switch (snapshot.state) {
											  case firebase.storage.TaskState.PAUSED:
												break;
											  case firebase.storage.TaskState.RUNNING:
												break;
											}
										  }, function(error) {
										  switch (error.code) {
											case 'storage/unauthorized':
												notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
											  break;
											case 'storage/canceled':
											  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
											  break;
											case 'storage/unknown':
											  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
											  break;
										  }
										}, function() {
											var tamanho = uploadimagemtask.snapshot.totalBytes;
											var url = uploadimagemtask.snapshot.downloadURL;
											if(file.type == "image/jpeg"){
												var icone = "image";
												var thumbnail = "img/demo/thumb-jpeg.png"
											}
											if(file.type == "image/png"){
												var icone = "image";
												var thumbnail = "img/demo/thumb-png.png"
											}
											firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + nomealeatorio).set({
												nome: nomedoarquivo,
												linkdireto: url,
												criado: file.lastModifiedDate.toLocaleDateString(),
												enviado: today,
												tipo: file.type,
												thumbnail: thumbnail,
												id: nomealeatorio,
												tamanho: tamanho,
												icone: icone,
												compartilhado: "false",
												descricao: "Nenhuma descrição até o momento"
											});
											notificacao('Arquivo enviado com sucesso', '-light');
											var progressid = "#" + nomealeatorio;
											$( progressid ).html("");
											funcaorecarregararquivodousuario();
										});
						
					}else{
						notificacao('Você não tem espaço disponivel para enviar esse arquivo', '-light');
					}
				});
			});
		}
		
		// enviar arquivo de audio
		if(file.type == "audio/mp3"){
			firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
				var emuso = snapshot.val().emuso;
				firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçorestante').once('value').then(function(snapshot) {
					var restante = snapshot.val().restante;
					var espaçodisponivel = (restante-emuso);
					if(espaçodisponivel > tamanhodoarquivodoupload){
						var nomealeatorio = firebase.database().ref().child('armazenamento/arquivos/' + userId).push().key;
						var progress = 0;
						$('#tarefaslist').append("<div id='" + nomealeatorio + "' class='list-group-item'><div class='list-group__heading m-b-5'>Enviando " + file.name + "</div><div class='progress'><div id='progress" + nomealeatorio + "' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style=''></div></div><p id='velocidade-" + nomealeatorio + "'></p></div>");
						$( "#taskbutton" ).addClass( "active" );
						var uploadimagemtask = cloudprincipal.child('armazenamento/arquivos/'  + userId + '/audios/' + nomealeatorio).put(file, metadata);
						// enviando arquivo
										uploadimagemtask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
										  function(snapshot) {
											var progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
											var txtprogress = (progress + "%");
											var progressid = "#progress" + nomealeatorio;
											$( progressid ).css( "width", txtprogress);
											var velocidadeid = "#velocidade-" + nomealeatorio;
											$( velocidadeid ).text(informacaotamanho(snapshot.bytesTransferred,true) + " / " + informacaotamanho(snapshot.totalBytes,true));
											
											switch (snapshot.state) {
											  case firebase.storage.TaskState.PAUSED:
												break;
											  case firebase.storage.TaskState.RUNNING:
												break;
											}
										  }, function(error) {
										  switch (error.code) {
											case 'storage/unauthorized':
												notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
											  break;
											case 'storage/canceled':
											  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
											  break;
											case 'storage/unknown':
											  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
											  break;
										  }
										}, function() {
											var tamanho = uploadimagemtask.snapshot.totalBytes;
											var url = uploadimagemtask.snapshot.downloadURL;
											if(file.type == "audio/mp3"){
												var icone = "music";
												var thumbnail = "img/demo/thumb-mp3.png";
											}
											firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + nomealeatorio).set({
												nome: nomedoarquivo,
												linkdireto: url,
												criado: file.lastModifiedDate.toLocaleDateString(),
												enviado: today,
												tipo: file.type,
												thumbnail: thumbnail,
												id: nomealeatorio,
												tamanho: tamanho,
												icone: icone,
												compartilhado: "false",
												descricao: "Nenhuma descrição até o momento"
											});
											notificacao('Arquivo enviado com sucesso', '-light');
											var progressid = "#" + nomealeatorio;
											$( progressid ).html("");
											funcaorecarregararquivodousuario();
										});
						
					}else{
						notificacao('Você não tem espaço disponivel para enviar esse arquivo', '-light');
					}
				});
			});
		}
		
		// enviar arquivo de video
		if(file.type == "video/mp4" || file.type == "video/x-matroska"){
			firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
				var emuso = snapshot.val().emuso;
				firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçorestante').once('value').then(function(snapshot) {
					var restante = snapshot.val().restante;
					var espaçodisponivel = (restante-emuso);
					if(espaçodisponivel > tamanhodoarquivodoupload){
						var nomealeatorio = firebase.database().ref().child('armazenamento/arquivos/' + userId).push().key;
						var progress = 0;
						$('#tarefaslist').append("<div id='" + nomealeatorio + "' class='list-group-item'><div class='list-group__heading m-b-5'>Enviando " + file.name + "</div><div class='progress'><div id='progress" + nomealeatorio + "' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style=''></div></div><p id='velocidade-" + nomealeatorio + "'></p></div>");
						$( "#taskbutton" ).addClass( "active" );
						var uploadimagemtask = cloudprincipal.child('armazenamento/arquivos/'  + userId + '/videos/' + nomealeatorio).put(file, metadata);
						// enviando arquivo
										uploadimagemtask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
										  function(snapshot) {
											var progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
											var txtprogress = (progress + "%");
											var progressid = "#progress" + nomealeatorio;
											$( progressid ).css( "width", txtprogress);
											var velocidadeid = "#velocidade-" + nomealeatorio;
											$( velocidadeid ).text(informacaotamanho(snapshot.bytesTransferred,true) + " / " + informacaotamanho(snapshot.totalBytes,true));
											
											switch (snapshot.state) {
											  case firebase.storage.TaskState.PAUSED:
												break;
											  case firebase.storage.TaskState.RUNNING:
												break;
											}
										  }, function(error) {
										  switch (error.code) {
											case 'storage/unauthorized':
												notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
											  break;
											case 'storage/canceled':
											  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
											  break;
											case 'storage/unknown':
											  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
											  break;
										  }
										}, function() {
											var tamanho = uploadimagemtask.snapshot.totalBytes;
											var url = uploadimagemtask.snapshot.downloadURL;
											if(file.type == "video/mp4"){
												var icone = "video";
												var thumbnail = "img/demo/thumb-mp4.png";
											}
											if(file.type == "video/x-matroska"){
												var icone = "video";
												var thumbnail = "img/demo/thumb-mkv.png";
											}
											firebase.database().ref('armazenamento/arquivos/'  + userId + '/' + nomealeatorio).set({
												nome: nomedoarquivo,
												linkdireto: url,
												criado: file.lastModifiedDate.toLocaleDateString(),
												enviado: today,
												tipo: file.type,
												thumbnail: thumbnail,
												id: nomealeatorio,
												tamanho: tamanho,
												icone: icone,
												compartilhado: "false",
												descricao: "Nenhuma descrição até o momento"
											});
											notificacao('Arquivo enviado com sucesso', '-light');
											var progressid = "#" + nomealeatorio;
											$( progressid ).html("");
											funcaorecarregararquivodousuario();
										});
						
					}else{
						notificacao('Você não tem espaço disponivel para enviar esse arquivo', '-light');
					}
				});
			});
		}
	}else{notificacao('Ainda não oferecemos suporte para essa extensão', '-light');}
}
function funcaoexcluirpasta(id) {
	console.log(id);	
};
function funcaoadddescricaofile(id) {
	console.log(id);	
};
function funcaoadddescricaopasta(id) {
	console.log(id);	
};
function funcaoabrirpasta(item) {
	var pastaid = $(item).attr( "data-item-id" );
	var nome = $(item).attr( "data-item-nome" );
	$('#list-pastas').html("");
	$('#list-arquivos').html("");
	$('#txtpastas').text("");
	$('#txtarquivos-pasta').text("");
	$('#btn-add-pasta').hide();
	$('#btn-voltar').show();
	$('#moverdoprincipal').hide();
	$('#renomeardoprincipal').hide();
	$('#deletardoprincipal').hide();
	$('#deletardapasta').show();
	$('#renomeardapasta').show();
	$('#moverdapasta').show();
	$('#btnenviararquivopasta').show();
	var user = firebase.auth().currentUser;
	var userId = user.uid;
	funcaorecarregararquivodapasta(pastaid, nome);
	firebase.database().ref('armazenamento/pastas/' + userId + '/' + pastaid).update({
				aberto: today
	});
	function enviararquivopasta(evt) {
		$.each($('#enviararquivo').prop("files"), function(k,v){
					var filename = v['name'];
		});
		evt.stopPropagation();
		evt.preventDefault();
		var file = evt.target.files[0];
		var metadata = {
		   'contentType': file.type
		};
		var x = file.name;
		var nomedoarquivo = x.substring(0, x.lastIndexOf('.'));
		var cloudprincipal = firebase.storage().ref();
		var tamanhodoarquivodoupload = file.size;
		if(file.type == "image/jpeg" || file.type == "image/png" || file.type == "audio/mp3" || file.type == "video/mp4" || file.type == "video/x-matroska"){
			// enviar arquivo de imagem
			if(file.type == "image/jpeg" || file.type == "image/png"){
				firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
					var emuso = snapshot.val().emuso;
					firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçorestante').once('value').then(function(snapshot) {
						var restante = snapshot.val().restante;
						var espaçodisponivel = (restante-emuso);
						if(espaçodisponivel > tamanhodoarquivodoupload){
							var nomealeatorio = firebase.database().ref().child('armazenamento/arquivos/'  + userId + '/pastas/' + pastaid).push().key;
							var progress = 0;
							$('#tarefaslist').append("<div id='" + nomealeatorio + "' class='list-group-item'><div class='list-group__heading m-b-5'>Enviando " + file.name + "</div><div class='progress'><div id='progress" + nomealeatorio + "' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style=''></div></div><p id='velocidade-" + nomealeatorio + "'></p></div>");
							$( "#taskbutton" ).addClass( "active" );
							var uploadimagemtask = cloudprincipal.child('armazenamento/arquivos/'  + userId + '/imagens/' + nomealeatorio).put(file, metadata);
							// enviando arquivo
											uploadimagemtask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
											  function(snapshot) {
												var progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
												var txtprogress = (progress + "%");
												var progressid = "#progress" + nomealeatorio;
												$( progressid ).css( "width", txtprogress);
												var velocidadeid = "#velocidade-" + nomealeatorio;
												$( velocidadeid ).text(informacaotamanho(snapshot.bytesTransferred,true) + " / " + informacaotamanho(snapshot.totalBytes,true));
												
												switch (snapshot.state) {
												  case firebase.storage.TaskState.PAUSED:
													break;
												  case firebase.storage.TaskState.RUNNING:
													break;
												}
											  }, function(error) {
											  switch (error.code) {
												case 'storage/unauthorized':
													notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
												  break;
												case 'storage/canceled':
												  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
												  break;
												case 'storage/unknown':
												  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
												  break;
											  }
											}, function() {
												var tamanho = uploadimagemtask.snapshot.totalBytes;
												var url = uploadimagemtask.snapshot.downloadURL;
												if(file.type == "image/jpeg"){
													var icone = "image";
													var thumbnail = "img/demo/thumb-jpeg.png"
												}
												if(file.type == "image/png"){
													var icone = "image";
													var thumbnail = "img/demo/thumb-png.png"
												}
												firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + nomealeatorio).set({
													nome: nomedoarquivo,
													linkdireto: url,
													criado: file.lastModifiedDate.toLocaleDateString(),
													enviado: today,
													tipo: file.type,
													thumbnail: thumbnail,
													id: nomealeatorio,
													tamanho: tamanho,
													icone: icone,
													compartilhado: "false",
													descricao: "Nenhuma descrição até o momento"
												});
												notificacao('Arquivo enviado com sucesso', '-light');
												var progressid = "#" + nomealeatorio;
												$( progressid ).html("");
												funcaorecarregararquivodapasta(pastaid, nome);
											});
							
						}else{
							notificacao('Você não tem espaço disponivel para enviar esse arquivo', '-light');
						}
					});
				});
			}
			
			// enviar arquivo de audio
			if(file.type == "audio/mp3"){
				firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
					var emuso = snapshot.val().emuso;
					firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçorestante').once('value').then(function(snapshot) {
						var restante = snapshot.val().restante;
						var espaçodisponivel = (restante-emuso);
						if(espaçodisponivel > tamanhodoarquivodoupload){
							var nomealeatorio = firebase.database().ref().child('armazenamento/arquivos/'  + userId + '/pastas/' + pastaid).push().key;
							var progress = 0;
							$('#tarefaslist').append("<div id='" + nomealeatorio + "' class='list-group-item'><div class='list-group__heading m-b-5'>Enviando " + file.name + "</div><div class='progress'><div id='progress" + nomealeatorio + "' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style=''></div></div><p id='velocidade-" + nomealeatorio + "'></p></div>");
							$( "#taskbutton" ).addClass( "active" );
							var uploadimagemtask = cloudprincipal.child('armazenamento/arquivos/'  + userId + '/audios/' + nomealeatorio).put(file, metadata);
							// enviando arquivo
											uploadimagemtask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
											  function(snapshot) {
												var progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
												var txtprogress = (progress + "%");
												var progressid = "#progress" + nomealeatorio;
												$( progressid ).css( "width", txtprogress);
												var velocidadeid = "#velocidade-" + nomealeatorio;
												$( velocidadeid ).text(informacaotamanho(snapshot.bytesTransferred,true) + " / " + informacaotamanho(snapshot.totalBytes,true));
												
												switch (snapshot.state) {
												  case firebase.storage.TaskState.PAUSED:
													break;
												  case firebase.storage.TaskState.RUNNING:
													break;
												}
											  }, function(error) {
											  switch (error.code) {
												case 'storage/unauthorized':
													notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
												  break;
												case 'storage/canceled':
												  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
												  break;
												case 'storage/unknown':
												  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
												  break;
											  }
											}, function() {
												var tamanho = uploadimagemtask.snapshot.totalBytes;
												var url = uploadimagemtask.snapshot.downloadURL;
												if(file.type == "audio/mp3"){
													var icone = "music";
													var thumbnail = "img/demo/thumb-mp3.png";
												}
												firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + nomealeatorio).set({
													nome: nomedoarquivo,
													linkdireto: url,
													criado: file.lastModifiedDate.toLocaleDateString(),
													enviado: today,
													tipo: file.type,
													thumbnail: thumbnail,
													id: nomealeatorio,
													tamanho: tamanho,
													icone: icone,
													compartilhado: "false",
													descricao: "Nenhuma descrição até o momento"
												});
												notificacao('Arquivo enviado com sucesso', '-light');
												var progressid = "#" + nomealeatorio;
												$( progressid ).html("");
												funcaorecarregararquivodapasta(pastaid, nome);
											});
							
						}else{
							notificacao('Você não tem espaço disponivel para enviar esse arquivo', '-light');
						}
					});
				});
			}
			
			// enviar arquivo de video
			if(file.type == "video/mp4" || file.type == "video/x-matroska"){
				firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
					var emuso = snapshot.val().emuso;
					firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçorestante').once('value').then(function(snapshot) {
						var restante = snapshot.val().restante;
						var espaçodisponivel = (restante-emuso);
						if(espaçodisponivel > tamanhodoarquivodoupload){
							var nomealeatorio = firebase.database().ref().child('armazenamento/arquivos/'  + userId + '/pastas/' + pastaid).push().key;
							var progress = 0;
							$('#tarefaslist').append("<div id='" + nomealeatorio + "' class='list-group-item'><div class='list-group__heading m-b-5'>Enviando " + file.name + "</div><div class='progress'><div id='progress" + nomealeatorio + "' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style=''></div></div><p id='velocidade-" + nomealeatorio + "'></p></div>");
							$( "#taskbutton" ).addClass( "active" );
							var uploadimagemtask = cloudprincipal.child('armazenamento/arquivos/'  + userId + '/videos/' + nomealeatorio).put(file, metadata);
							// enviando arquivo
											uploadimagemtask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
											  function(snapshot) {
												var progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
												var txtprogress = (progress + "%");
												var progressid = "#progress" + nomealeatorio;
												$( progressid ).css( "width", txtprogress);
												var velocidadeid = "#velocidade-" + nomealeatorio;
												$( velocidadeid ).text(informacaotamanho(snapshot.bytesTransferred,true) + " / " + informacaotamanho(snapshot.totalBytes,true));
												
												switch (snapshot.state) {
												  case firebase.storage.TaskState.PAUSED:
													break;
												  case firebase.storage.TaskState.RUNNING:
													break;
												}
											  }, function(error) {
											  switch (error.code) {
												case 'storage/unauthorized':
													notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
												  break;
												case 'storage/canceled':
												  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
												  break;
												case 'storage/unknown':
												  notificacao('Desculpa, Tive um problema para enviar seu arquivo', '-light');
												  break;
											  }
											}, function() {
												var tamanho = uploadimagemtask.snapshot.totalBytes;
												var url = uploadimagemtask.snapshot.downloadURL;
												if(file.type == "video/mp4"){
													var icone = "video";
													var thumbnail = "img/demo/thumb-mp4.png";
												}
												if(file.type == "video/x-matroska"){
													var icone = "video";
													var thumbnail = "img/demo/thumb-mkv.png";
												}
												firebase.database().ref('armazenamento/pastas/'  + userId + '/' + pastaid + '/arquivos/' + nomealeatorio).set({
													nome: nomedoarquivo,
													linkdireto: url,
													criado: file.lastModifiedDate.toLocaleDateString(),
													enviado: today,
													tipo: file.type,
													thumbnail: thumbnail,
													id: nomealeatorio,
													tamanho: tamanho,
													icone: icone,
													compartilhado: "false",
													descricao: "Nenhuma descrição até o momento"
												});
												notificacao('Arquivo enviado com sucesso', '-light');
												var progressid = "#" + nomealeatorio;
												$( progressid ).html("");
												funcaorecarregararquivodapasta(pastaid, nome);
											});
							
						}else{
							notificacao('Você não tem espaço disponivel para enviar esse arquivo', '-light');
						}
					});
				});
			}
		}else{notificacao('Ainda não oferecemos suporte para essa extensão', '-light');}
	}
	document.getElementById('enviararquivopasta').addEventListener('change', enviararquivopasta, false);
};
function fecharpasta(){
	$('#list-pastas').html("");
	$('#list-arquivos').html("");
	$('#txtpastas').text("");
	$('#txtarquivos-pasta').text("");
	$('#btn-add-pasta').show();
	$('#btn-voltar').hide();
	$('#moverdoprincipal').show();
	$('#renomeardoprincipal').show();
	$('#deletardoprincipal').show();
	$('#deletardapasta').hide();
	$('#renomeardapasta').hide();
	$('#moverdapasta').hide();
	$('#btnenviararquivopasta').hide();
	funcaorecarregararquivodousuario();
	funcaorecarregarpastadousuario();
}