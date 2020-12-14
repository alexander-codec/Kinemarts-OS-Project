$(window).load(function(){
	$('#adicionarkeysbutton').show();
	$('#salvarkeyprivada').show();
});
var versaoconectada = "1";
firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
			var userId = user.uid;
			firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçorestante').once('value').then(function(snapshot) {
				var jk = snapshot.val();
				if(jk == null){
					$('#content').append("<div class='thumbnail'><img src='img/demo/headers/sm/5.png'><div class='caption'><center><h4>Nenhuma informação a ser informada</h4></center></div></div>");
				}else{
					var total = snapshot.val().restante;
					$('#estadoarmazenamento').show();
					firebase.database().ref('armazenamento/espaço/'  + userId + '/espaçoemuso').once('value').then(function(snapshot) {
							var usado = snapshot.val().emuso;
							var disponivel = (total-usado);
							function tamanhodisponivel(bytes, si) {
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
							var txtdisponivel = tamanhodisponivel(disponivel,true);
							$('#armazenamentodisponivel').text("Disponivel: " + txtdisponivel);
					});
					'use strict';

					$(document).ready(function(){
						
						// Make some random data for the Chart
						var d1 = [];
						for (var i = 0; i <= 10; i += 1) {
							d1.push([i, parseInt(Math.random() * 30)]);
						}
						var d2 = [];
						for (var i = 0; i <= 25; i += 4) {
							d2.push([i, parseInt(Math.random() * 30)]);
						}    
						var d3 = [];
						for (var i = 0; i <= 10; i += 1) {
							d3.push([i, parseInt(Math.random() * 30)]);
						}
						
						// Chart Options
						var options = {
							series: {
								shadowSize: 0,
								curvedLines: {
									apply: true,
									active: true,
									monotonicFit: true
								},
								lines: {
									show: false,
									lineWidth: 0
								}
							},
							grid: {
								borderWidth: 0,
								labelMargin:10,
								hoverable: true,
								clickable: true,
								mouseActiveRadius:6
								
							},
							xaxis: {
								tickDecimals: 0,
								ticks: false
							},
							
							yaxis: {
								tickDecimals: 0,
								ticks: false
							},
							
							legend: {
								show: false
							}
						};
						
						// Let's create the chart
						if ($("#chart-curved-line")[0]) {
							$.plot($("#chart-curved-line"), [
								{
									data: d1,
									lines: {
										show: true,
										fill: 0.98
									},
									label: 'Usado',
									stack: true,
									color: '#1e2a31'
								}, {
									data: d3,
									lines: {
										show: true,
										fill: 0.98
									},
									label: 'Em uso',
									stack: true,
									color: '#edeff0'
								}
							], options);
						}
						
						if ($("#chart-past-days")[0]) {
							$.plot($("#chart-past-days"), [{
								data: d2,
								lines: {
									show: true,
									fill: 1,
								},
								label: 'Product 1',
								stack: true,
								color: '#35424b'
							}], options);
						}
						
						// Tooltips for Flot Charts
						if ($('.flot-chart')[0]) {
							$('.flot-chart').bind('plothover', function (event, pos, item) {
								if (item) {
									var x = item.datapoint[0].toFixed(2),
										y = item.datapoint[1].toFixed(2);
									$('.flot-tooltip').html(item.series.label + ' ' + x + 'MB de ' + y + 'MB').css({top: item.pageY+5, left: item.pageX+5}).show();
								}
								else {
									$('.flot-tooltip').hide();
								}
							});
							
							$('<div class="flot-tooltip"></div>').appendTo('body');
						}
					});
				}
			});
			var cadastro = firebase.database().ref('users/' + user.uid + '/informacoesbasica').once('value').then(function(snapshot) {
					var perfil = snapshot.val();
					if( perfil != null){
							var cidade = perfil.cidade;
							var estado = perfil.estado;
							$('#previsaodotempo').show();
							// Obtém a data/hora atual
							var data = new Date();
							var hora    = data.getHours();          // 0-23
							var min     = data.getMinutes();        // 0-59
							var seg     = data.getSeconds();        // 0-59
							var str_hora = hora + ':' + min + ':' + seg;
							var b;$.simpleWeather({location:cidade + "," + estado,woeid:"",unit:"c",success:function(a){var c='<div class="weather-block text-xs-center"><div class="weather-block_display"><div class="widget-weather__icon widget-weather__icon-'+a.code+'"></div><h2>'+a.temp+"&deg;"+a.units.temp+'<i class="wi wi-degrees"></i></h2></div><div class="weather-display-title text-xs-center"><h5>'+a.city+", "+a.region+'</h5><h5>'+str_hora+'</h5></div></div><ul class="widget-weather__upcoming clearfix"></ul>';$("#widget-weather__main").html(c),setTimeout(function(){for(b=0;b<5;b++){var c='<li class="media"><span class="pull-left widget-weather__icon widget-weather__icon-sm widget-weather__icon-'+a.forecast[b].code+'"></span><span class="pull-right">max °'+a.forecast[b].high+"/min °"+a.forecast[b].low+'</span><span class="media-body">'+a.forecast[b].date+"</span></li>";$(".widget-weather__upcoming").append(c)}})},error:function(a){$("#widget-weather__main").html("<p>"+a+"</p>")}})
							document.getElementById('atualizarprevisao').addEventListener('click', previsaotempo, false);
					}
			});
			setTimeout(function() {
				$('#adicionarkeysbutton').show();
				$('#salvarkeyprivada').show(); 
			}, 5500);
        }
});