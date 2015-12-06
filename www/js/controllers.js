//http://kaerzas.pythonanywhere.com/
//http://kaerzas.pythonanywhere.com/

angular.module('starter.controllers', ['starter.services', 'ionic-ratings'])

.controller('AppCtrl', function($state, $scope, $ionicModal, $timeout, $http, $ionicActionSheet,$ionicPopup) {

	// INFORMACION DE USUARIO
	$http.get('http://kaerzas.pythonanywhere.com/usuarios/dameUsuario/', {
		headers: {
			'Authorization': 'Token ' + window.localStorage.getItem("token"),
			'Access-Control-Allow-Origin':'*',
		}
	})
	.success(function(data) {
		$scope.usuario = data.user;
		$scope.nombre = data.serializer.username;
		$scope.imagen = data.serializer.imagen;
	})




	$scope.takePic = function(medio) {
		var options =   {
				quality: 50,
				allowEdit: true,
				correctOrientation: true,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: medio,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
				encodingType: 0     // 0=JPG 1=PNG
		}
		navigator.camera.getPicture(onSuccess,onFail,options);
	}
	var onSuccess = function(FILE_URI) {
		console.log(FILE_URI);
		$scope.picData = FILE_URI;
		$scope.$apply();
		send();
	};
	var onFail = function(e) {
		console.log("On fail " + e);
	}

	//LISTA DE OPCIONES
	$scope.addFoto = function() {
		// Mostrar contenido de acciones
		var hideSheet = $ionicActionSheet.show({
			buttons: [
			          { text: 'Cámara' },
			          { text: 'Galería' }
			          ],
			          titleText: 'Añadir desde...',
			          cancelText: 'Cancelar',
			          cancel: function() {
			        	  // add cancel code..
			        	  console.log('CANCELADO');
			          },
			          buttonClicked: function(index) {
			        	  switch (index) {
			        	  case 0:
			        		  $scope.takePic("1");//Tomar desde Cámara
			        		  return true;
			        	  case 1:
			        		  $scope.takePic("0");//Tomar desde Galería
			        		  return true;
			        	  }
			          }
		})
	};


	function send() {

		var myImg = $scope.picData;

		if(typeof myImg === 'undefined'){
			//NO AÑADIR FOTO -> ERROR
			$scope.showAlert = function() {
				var alertPopup = $ionicPopup.alert({
					title: 'Error al modificar',
					template: 'No se ha podido cargar la imagen.'
				});
				alertPopup.then(function(res) {
					console.log('Login incorrecto');
				});
			};
			$scope.showAlert();
		} else {
			//AÑADIR FOTO
			try {
				var options = new FileUploadOptions();
				options.fileKey="imagen";
				options.chunkedMode = false;
				options.httpMethod = "PUT";
				options.headers = {'Authorization': 'Token ' + window.localStorage.getItem("token")};
				var params = {};
				params.email = "null@null.com";
				options.params = params;
				var ft = new FileTransfer();
				ft.upload(myImg, encodeURI("http://kaerzas.pythonanywhere.com/usuarios/anyadirUsuario/"), onUploadSuccess, onUploadFail, options);
			}
			catch(err) {
				// An alert dialog
				console.log(err);
				$scope.showAlert = function() {
					var alertPopup = $ionicPopup.alert({
						title: 'Error al añadir',
						template: 'Revise los campos y asegúrese de añadir una imagen.'
					});
					alertPopup.then(function(res) {
						console.log('Login incorrecto');
					});
				};
				$scope.showAlert();
			}	
		}
	}
	var onUploadSuccess = function(FILE_URI) {
		delete $scope.picData;//Borrar foto
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Foto modificada',
				template: 'Los cambios surtiran efecto al reiniciar sesion.'
			});
			alertPopup.then(function(res) {
				console.log('Login incorrecto');
			});
		};
		$scope.showAlert();
		
		//$state.go($state.current, {}, {reload: true});
	};
	var onUploadFail = function(e) {
		// An alert dialog
		console.log(e);
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Error al añadir',
				template: 'Revise los campos y asegúrese de añadir una imagen.'
			});
			alertPopup.then(function(res) {
				console.log('Login incorrecto');
			});
		};
		$scope.showAlert();
	}
})

.controller('inicioCtrl', function($scope, $http, sharedToken) {

	var getTapas = function() {
		$http({method: 'GET', url: 'http://kaerzas.pythonanywhere.com/tapas/listaTapas/', params: {latitud:$scope.latitude, longitud:$scope.longitude, rango:$scope.user.value},headers: {
			'Authorization': 'Token ' + window.localStorage.getItem("token")}
		})
		.success(function(data) {
			$scope.greeting = data.serializer;
			$scope.usuario = data.user;
		})
		.finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	var onSuccess = function(position) {
		$scope.latitude=position.coords.latitude;

		$scope.longitude=position.coords.longitude;

		var p ={
				"latitud":$scope.latitude,
				"longitud":$scope.longitude,
		}

		console.log(sharedToken.getProperty());
		getTapas();
	};

	//	onError Callback receives a PositionError object
	function onError(error) {
		alert('code: '    + error.code    + '\n' +
				'message: ' + error.message + '\n');
	};

	$scope.user= {
			min:0,
			max:50000,
			value:5000
	}
	console.log($scope.user.value);

	navigator.geolocation.getCurrentPosition(onSuccess, onError);	
	console.log(sharedToken.getProperty());

	$scope.doRefresh = function(){
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}
	
	$scope.$on('$ionicView.enter', function(){
		getTapas();
	});
})

.controller('PhotoController', function($scope, $cordovaCamera, $ionicActionSheet) {

	// CAMARA
	$scope.takePic = function(medio) {
		var options =   {
				quality: 50,
				destinationType: Camera.DestinationType.FILE_URI,
				correctOrientation: true,
				sourceType: medio,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
				encodingType: 0     // 0=JPG 1=PNG
		}
		navigator.camera.getPicture(onSuccess,onFail,options);
	}
	var onSuccess = function(FILE_URI) {
		console.log(FILE_URI);
		$scope.picData = FILE_URI;
		$scope.$apply();
	};
	var onFail = function(e) {
		console.log("On fail " + e);
	}

	//LISTA DE OPCIONES
	$scope.addMedia = function() {
		// Mostrar contenido de acciones
		var hideSheet = $ionicActionSheet.show({
			buttons: [
			          { text: 'Cámara' },
			          { text: 'Galería' }
			          ],
			          titleText: 'Añadir desde...',
			          cancelText: 'Cancelar',
			          cancel: function() {
			        	  // add cancel code..
			        	  console.log('CANCELADO');
			          },
			          buttonClicked: function(index) {
			        	  switch (index) {
			        	  case 0:
			        		  $scope.takePic("1");//Tomar desde Cámara
			        		  return true;
			        	  case 1:
			        		  $scope.takePic("0");//Tomar desde Galería
			        		  return true;
			        	  }
			          }
		})
	};

})

.controller('anyadirBarCtrl', function($scope, $http, $controller, sharedToken, $ionicPopup) {

	$controller('PhotoController', {$scope: $scope});//Usar un controlador desde otro controlador

	// INFORMACION DE USUARIO
	$http.get('http://kaerzas.pythonanywhere.com/usuarios/dameUsuario/', {
		headers: {
			'Authorization': 'Token ' + window.localStorage.getItem("token")
		}
	})
	.success(function(data) {
		$scope.usuario = data.user;
	})

	// POSICION
	var onSuccess = function(position) {
		$scope.latitude=position.coords.latitude;
		$scope.longitude=position.coords.longitude;
		//para cargar los parametros del mapa

		$scope.centro=[position.coords.latitude, position.coords.longitude];
	};
	function onError(error) {
		alert('code: '    + error.code    + '\n' +
				'message: ' + error.message + '\n');
	};
	navigator.geolocation.getCurrentPosition(onSuccess, onError);


	$scope.reset = function(BarForm) {
		$scope.bar = {};
	};

	$scope.bar = [];
	$scope.send = function() {

		var myImg = $scope.picData;

		//AÑADIR BAR SIN FOTO
		if(typeof myImg === 'undefined'){
			var b = {
					"nombre": $scope.bar.nombre,
					"latitud": $scope.latitude,
					"longitud": $scope.longitude,
					"descripcion": $scope.bar.descripcion,     
					"fechaSubida": new Date(),
					"usuarioRegistro": $scope.usuario
			}			
			$http.post('http://kaerzas.pythonanywhere.com/tapas/anyadirBar/', b, {
				headers: {
					'Authorization': 'Token ' + window.localStorage.getItem("token")
				}
			})	
			.success(function(data) {
				console.log("#/app/detalleBar/" + data.id)
				window.location = "#/app/detalleBar/" + data.id;
			})
			.error(function(data){
				$scope.showAlert = function() {
					var alertPopup = $ionicPopup.alert({
						title: 'Error al añadir',
						template: 'Revise los campos y active la geolocalización si no está activada.'
					});
					alertPopup.then(function(res) {
						console.log('Login incorrecto');
					});
				};
				$scope.showAlert();
			})
			//AÑADIR BAR CON FOTO
		} else {
			try {
				var options = new FileUploadOptions();
				options.fileKey="imagen";
				options.chunkedMode = false;
				options.httpMethod = "POST";
				options.headers = {'Authorization': 'Token ' + window.localStorage.getItem("token")};
				var params = {};
				params.nombre = $scope.bar.nombre;
				params.descripcion = $scope.bar.descripcion;
				params.longitud = $scope.longitude;
				params.latitud = $scope.latitude;
				params.fechaSubida = new Date();
				params.usuarioRegistro = $scope.usuario;
				options.params = params;
				var ft = new FileTransfer();
				ft.upload(myImg, encodeURI("http://kaerzas.pythonanywhere.com/tapas/anyadirBar/"), onUploadSuccess, onUploadFail, options);
			}
			catch(err) {
				// An alert dialog
				$scope.showAlert = function() {
					var alertPopup = $ionicPopup.alert({
						title: 'Error al añadir',
						template: 'Revise los campos y active la geolocalización si no está activada.'
					});
					alertPopup.then(function(res) {
						console.log('Login incorrecto');
					});
				};
				$scope.showAlert();
			}	
		}

	}

	var onUploadSuccess = function(data) {
		var bar = JSON.parse(data.response);
		console.log("#/app/detalleBar/" + bar.id)
		window.location = "#/app/detalleBar/" + bar.id;
	};
	var onUploadFail = function(e) {
		// An alert dialog
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Error al añadir',
				template: 'Revise los campos y active la geolocalización si no está activada.'
			});
			alertPopup.then(function(res) {
				console.log('Login incorrecto');
			});
		};
		$scope.showAlert();
	}

	$scope.$on('$ionicView.afterLeave', function(){
		$scope.reset();//Limpiar formulario
		if ($scope.picData) {
			delete $scope.picData;//Borrar foto
		}
	});
})

.controller('anyadirTapaCtrl', function($scope, $http, $stateParams, $controller, sharedToken, $ionicPopup) {

	var id_bar = $stateParams.id;
	$controller('PhotoController', {$scope: $scope});//Usar un controlador desde otro controlador

	// INFORMACION DE USUARIO
	$http.get('http://kaerzas.pythonanywhere.com/usuarios/dameUsuario/', {
		headers: {
			'Authorization': 'Token ' + window.localStorage.getItem("token")
		}
	})
	.success(function(data) {
		$scope.usuario = data.user;
	})

	$scope.reset = function(TapaForm) {
		$scope.tapa = {};
	};

	$scope.tapa = [];
	$scope.send = function() {

		var myImg = $scope.picData;

		if(typeof myImg === 'undefined'){
			//AÑADIR TAPA SIN FOTO -> ERROR
			$scope.showAlert = function() {
				var alertPopup = $ionicPopup.alert({
					title: 'Error al añadir',
					template: 'Revise los campos y asegúrese de añadir una imagen.'
				});
				alertPopup.then(function(res) {
					console.log('Login incorrecto');
				});
			};
			$scope.showAlert();
		} else {
			//AÑADIR TAPA CON FOTO
			try {
				var options = new FileUploadOptions();
				options.fileKey="imagen";
				options.chunkedMode = false;
				options.httpMethod = "POST";
				options.headers = {'Authorization': 'Token ' + window.localStorage.getItem("token")};
				var params = {};
				params.nombre = $scope.tapa.nombre;
				params.descripcion = $scope.tapa.descripcion;
				params.bar = id_bar;
				params.fechaSubida = new Date();
				params.usuarioRegistro = $scope.usuario;
				options.params = params;
				var ft = new FileTransfer();
				ft.upload(myImg, encodeURI("http://kaerzas.pythonanywhere.com/tapas/anyadirTapa/"), onUploadSuccess, onUploadFail, options);
			}
			catch(err) {
				// An alert dialog
				$scope.showAlert = function() {
					var alertPopup = $ionicPopup.alert({
						title: 'Error al añadir',
						template: 'Revise los campos y asegúrese de añadir una imagen.'
					});
					alertPopup.then(function(res) {
						console.log('Login incorrecto');
					});
				};
				$scope.showAlert();
			}	
		}

	}

	var onUploadSuccess = function(data) {
		var tapa = JSON.parse(data.response);
		window.location = "#/app/detalleTapa/" + tapa.id;
	};
	var onUploadFail = function(e) {
		// An alert dialog
		console.log(e);
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Error al añadir',
				template: 'Revise los campos y asegúrese de añadir una imagen.'
			});
			alertPopup.then(function(res) {
				console.log('Login incorrecto');
			});
		};
		$scope.showAlert();
	}

	$scope.$on('$ionicView.afterLeave', function(){
		$scope.reset();//Limpiar formulario
		if ($scope.picData) {
			delete $scope.picData;//Borrar foto
		}
	});
})

.controller('seleccionarBarCtrl', function($scope) {

}) 

.controller('anyadirBarPorTapaCtrl', function($scope) {

})



.controller('detalleTapaCtrl', function($scope, $http, $stateParams, $ionicPopup, $controller, sharedToken, $state, $cordovaInAppBrowser, $ionicActionSheet, $ionicSlideBoxDelegate) {

	// INFORMACION DE USUARIO
	$http.get('http://kaerzas.pythonanywhere.com/usuarios/dameUsuario/', {
		headers: {
			'Authorization': 'Token ' + window.localStorage.getItem("token")
		}
	})
	.success(function(data) {
		$scope.nombreUsuario = data.serializer.username;
	})

	var v = $stateParams.id;

	var getTapa = function() {

		$http.get('http://kaerzas.pythonanywhere.com/tapas/detalleTapa/' + v + '/', {
			//cache: false,
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})
		.success(function(data) {
			$scope.tapa = data.tapa;
			$scope.usuario = data.user;
			$scope.bar = data.bar;
			$scope.comentarios = data.comentarios;
			$scope.fotos = data.fotos.concat(data.tapa);
			$scope.usuarioRegistro = data.usuarioRegistro;
			$scope.favorito = data.favorito;
			window.localStorage.setItem("puntuacion",data.puntuacion);
			console.log($scope.bar.longitud);

			//para recargar el slider
			$ionicSlideBoxDelegate.update();

			//para cargar los parametros del mapa
			$scope.centro=[$scope.bar.latitud, $scope.bar.longitud];
			
			//para mostrar puntuacion del usuario en una tapa
			document.getElementById("rating"+window.localStorage['puntuacion']).checked = true;

		})
		.finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	getTapa();
	

	$scope.abrirGoogleMaps = function(){

		var onSuccess = function(position) {
			$scope.latitude=position.coords.latitude;
			$scope.longitude=position.coords.longitude;
			//para cargar los parametros del mapa


			$scope.posicionActual=[position.coords.latitude, position.coords.longitude];
			console.log($scope.posicionActual[0]);
			console.log($scope.posicionActual[1]);
			console.log($scope.centro[0]);
			console.log($scope.centro[1]);

			//window.open('URLmaps', '_system');
			console.log($scope.posicionActual);
		};

		function onError(error) {
			alert('code: '    + error.code    + '\n' +
					'message: ' + error.message + '\n');
		};

		navigator.geolocation.getCurrentPosition(onSuccess, onError);

		setTimeout(function(){ 
			console.log($scope.posicionActual);
			console.log($scope.centro);
			var URLmaps='https://www.google.es/maps/dir/'+String($scope.posicionActual[0])+','+String($scope.posicionActual[1])+'/'+$scope.centro[0]+','+$scope.centro[1];
			console.log(URLmaps);
			window.open(URLmaps, '_system');

		}, 200);

		//var URLmaps='https://www.google.es/maps/dir/'+$scope.posicionActual[0]+','+$scope.posicionActual[1]+'/'+$scope.centro[0]+','+$scope.centro[1];
		//console.log(URLmaps);

		//window.open(URLmaps, '_system');
	}

	//COLLAPSE MAP

	$scope.myStyle={visibility:'hidden', position:'absolute'}
	var visible = 0;

	$scope.collapse = function() {
		if (visible == 0){
			$scope.myStyle={visibility:'visible', position:'relative'};
			visible = 1;
		}else{
			$scope.myStyle={visibility:'hidden', position:'absolute'};
			visible = 0;
		}
	}
	
	//	METODO VALORACION
	
	$scope.sendPuntuacion = function (value) {

		var val = {				
				"puntuacion": value,     
				"tapa": v,
				"usuario": $scope.usuario
		}

		$http.post('http://kaerzas.pythonanywhere.com/tapas/anyadirValoracion/', val, {
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})	
		.success(function(data) {
			//console.log("La puntuacion es: "+value);
			$scope.doRefresh();
		})
	}

	// METODOS DE COMENTARIO

	$scope.updateComentario = function() {
		console.log($scope.comentario);
	};

	$scope.resetComentario = function(comentarioForm) {
		$scope.comentario = {};
	};

	$scope.guardarComentario= function(comentario) {

		var c = {				
				"descripcion": comentario.descripcion,     
				"fechaSubida": new Date(),
				"tapa": v,
				"usuario": $scope.usuario,
				"nombre": $scope.nombreUsuario
		}

		console.log(c)

		$http.post('http://kaerzas.pythonanywhere.com/tapas/anyadirComentario/', c, {
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})
		


		//alert(v);
		$http.get('http://kaerzas.pythonanywhere.com/tapas/dameToken/' + v + '/', {
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})
		.success(function(data) {



	
			var tokens = [];
	
			for (i = 0; i < data.tokens.length; i++) {
				tokens.push(data.tokens[i].key)
			}

			var authEncripted= btoa('1a4821acc8b40099b865f4da36fb8d1d3c554ff67590a1ea:');
			var notif = $scope.nombreUsuario + ": " + comentario.descripcion;
			 
					
			var notificacionPush = {
				"user_ids": tokens,
				"notification": {
					"title": "TappApp",
					"alert": notif,
				}
			}


			$http.post('https://push.ionic.io/api/v1/push', notificacionPush, {
				headers: {
					'Authorization': 'basic ' + authEncripted,
					'Content-Type': 'application/json', 
					'X-Ionic-Application-Id': '2aec3c19'
				}
			})		
			.error(function(error) {
				alert('code: '    + error.code    + '\n' +
				'message: ' + error.message + '\n');
			})

			window.location = "#/app/inicio";

	
		})
		.error(function(error) {
			alert('codigo: '    + error.code    + '\n' +
			'message: ' + error.message + '\n');
		})
		
		//window.reload();
		
	};

	// METODO DE FAVORITO
	$scope.cambiarEstado= function() {

		/*var c = {				
			    "descripcion": comentario.descripcion,     
			    "fechaSubida": new Date(),
			    "tapa": v,
			    "usuario": $scope.usuario
		}*/
		console.log(v)		

		$http.post('http://kaerzas.pythonanywhere.com/tapas/anyadirFavorito/' + v + '/', v, {
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})	
		.success(function(data) {
			//window.location = "#/app/inicio";
			//window.reload();
			$scope.doRefresh();
		})
	};

	// METODO DE AÑADIR OTRA FOTO
	// CAMARA
	$scope.takePic = function(medio) {
		var options =   {
				quality: 50,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: medio,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
				encodingType: 0     // 0=JPG 1=PNG
		}
		navigator.camera.getPicture(onSuccess,onFail,options);
	}
	var onSuccess = function(FILE_URI) {
		console.log(FILE_URI);
		$scope.picData = FILE_URI;
		$scope.$apply();
		send();
	};
	var onFail = function(e) {
		console.log("On fail " + e);
	}

	//LISTA DE OPCIONES
	$scope.addFoto = function() {
		// Mostrar contenido de acciones
		var hideSheet = $ionicActionSheet.show({
			buttons: [
			          { text: 'Cámara' },
			          { text: 'Galería' }
			          ],
			          titleText: 'Añadir desde...',
			          cancelText: 'Cancelar',
			          cancel: function() {
			        	  // add cancel code..
			        	  console.log('CANCELADO');
			          },
			          buttonClicked: function(index) {
			        	  switch (index) {
			        	  case 0:
			        		  $scope.takePic("1");//Tomar desde Cámara
			        		  return true;
			        	  case 1:
			        		  $scope.takePic("0");//Tomar desde Galería
			        		  return true;
			        	  }
			          }
		})
	};


	function send() {

		var myImg = $scope.picData;

		if(typeof myImg === 'undefined'){
			//NO AÑADIR FOTO -> ERROR
			$scope.showAlert = function() {
				var alertPopup = $ionicPopup.alert({
					title: 'Error al añadir',
					template: 'Revise los campos y asegúrese de añadir una imagen.'
				});
				alertPopup.then(function(res) {
					console.log('Login incorrecto');
				});
			};
			$scope.showAlert();
		} else {
			//AÑADIR FOTO
			try {
				var options = new FileUploadOptions();
				options.fileKey="imagen";
				options.chunkedMode = false;
				options.httpMethod = "POST";
				options.headers = {'Authorization': 'Token ' + window.localStorage.getItem("token")};
				var params = {};
				params.tapa = v;
				params.fechaSubida = new Date();
				params.usuario = $scope.usuario;
				options.params = params;
				var ft = new FileTransfer();
				ft.upload(myImg, encodeURI("http://kaerzas.pythonanywhere.com/tapas/anyadirFoto/"), onUploadSuccess, onUploadFail, options);
			}
			catch(err) {
				// An alert dialog
				$scope.showAlert = function() {
					var alertPopup = $ionicPopup.alert({
						title: 'Error al añadir',
						template: 'Revise los campos y asegúrese de añadir una imagen.'
					});
					alertPopup.then(function(res) {
						console.log('Login incorrecto');
					});
				};
				$scope.showAlert();
			}	
		}
	}
	var onUploadSuccess = function(FILE_URI) {
		delete $scope.picData;//Borrar foto
		$scope.doRefresh();	
	};
	var onUploadFail = function(e) {
		// An alert dialog
		console.log(e);
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Error al añadir',
				template: 'Revise los campos y asegúrese de añadir una imagen.'
			});
			alertPopup.then(function(res) {
				console.log('Login incorrecto');
			});
		};
		$scope.showAlert();
	}

	$scope.doRefresh = function(){
		getTapa();
	};

	$scope.showComments = function() {
		$scope.comments = !$scope.comments;
	};
})
.controller('listaBaresCtrl', function($scope, $http, sharedToken, $timeout, $ionicFilterBar, $window) {

	var filterBarInstance;

	var getBares = function() {

		//LISTAR BARES
		$http.get('http://kaerzas.pythonanywhere.com/tapas/listaBares/', {
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})
		.success(function(data) {
			console.log("funciona");
			$scope.items = data;
			filterBarInstance = null;

			//LISTAR BARES POR FILTRO
			$scope.showFilterBar = function () {
				filterBarInstance = $ionicFilterBar.show({
					items: $scope.items,
					update: function (filteredItems, filterText) {
						$scope.items = filteredItems;
						if (filterText) {
							console.log(filterText);
						}
					},
					filterProperties: 'nombre'
				});
			};
		})
		.error(function(data){
			console.log("no funciona");
		})
		.finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	getBares();

	$scope.doRefresh = function(){
		getBares();
	};

	//LEER QR
	$scope.scan = function() {
		console.log("escaneando...");
		cordova.plugins.barcodeScanner.scan(
				function (result) {
					/*alert(result.text + "\n" +
						"Format: " + result.format + "\n" +
						"Cancelled: " + result.cancelled);*/
					window.location = result.text;
					//Formato QR: #/app/detalleBar/3
				}, 
				function (error) {
					alert("Scanning failed: " + error);
				}
		);
	}
})


.controller('detalleBarCtrl', function($scope, $http, sharedToken, $stateParams) {


	var v = $stateParams.id;

	var getBar = function() {

		$http.get('http://kaerzas.pythonanywhere.com/tapas/detalleBar/' + v + '/', {
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})
		.success(function(data) {
			$scope.tapas = data.tapas;
			$scope.bar = data.bar;
		})
		.finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});

	}
	getBar();

	$scope.doRefresh = function(){

		getBar();
	};
})

.controller('registrarUsuarioCtrl', function($scope, $http,$ionicPopup) {

	$scope.update = function() {
		console.log($scope.user);
	};

	$scope.reset = function(UserForm) {
		$scope.user = {};
	};

	$scope.guardar= function(user) {

		var u = {
				"username": user.username,
				"password": user.password,
		}
		$http.post('http://kaerzas.pythonanywhere.com/usuarios/anyadirUsuario/', u)		
		.success(function(data) {
			window.location = "#/app/login";
		})
		.error(function(data){
			// An alert dialog
			$scope.showAlert = function() {
				var alertPopup = $ionicPopup.alert({
					title: 'Error al registrar',
					template: 'Ya existe un usuario con ese nombre. Vuelva a intentarlo.'
				});
				alertPopup.then(function(res) {
					console.log('Login incorrecto');
				});
			};
			$scope.showAlert();
		})		
	};
})

.controller('loginCtrl', function($scope, $http, sharedToken,$ionicPopup) {

	$scope.update = function() {
		console.log($scope.user);
	};

	$scope.reset = function(UserForm) {
		$scope.user = {};
	};

	$scope.guardar= function(user) {
		$http.post('http://kaerzas.pythonanywhere.com/api-token-auth/', 'username=' + user.username + '&password=' + user.password, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}

		})
		.success(function(data, user) {
			
			

			sharedToken.setProperty(data.token);
			window.localStorage.setItem("token",data.token);
			
				var io = Ionic.io();
    				var push = new Ionic.Push({
      					"onNotification": function(notification) {
        					var alerta = notification.message;
    						alert("alerta del onNotification");
      					},
      					"pluginConfig": {
        					"android": {
          						"icon": "ic_stat_logo",
          						"forceShow": true
        					}
      					}
    				});
    			var user = Ionic.User.current();
    			
    
    			if (!user.id) {
      				user.id = data.token;

   				}
    
    // Just add some dummy data..
    			
    			
    			user.save();
   
    			var callback = function(data) {
      				push.addTokenToUser(user);
      				
      				user.save();

    			};
    			push.register(callback);


    		window.location = "#/app/inicio";
		})
		.error(function(data){
			// An alert dialog
			$scope.showAlert = function() {
				var alertPopup = $ionicPopup.alert({
					title: 'Error al iniciar sesión',
					template: 'El usuario o la contraseña son incorrectos. Vuelva a intentarlo o regístrese.'
				});
				alertPopup.then(function(res) {
					console.log('Login incorrecto');
				});
			};
			$scope.showAlert();
		})
	};
})