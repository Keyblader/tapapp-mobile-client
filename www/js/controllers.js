// http://kaerzas.pythonanywhere.com/
// http://kaerzas.pythonanywhere.com/

angular.module('starter.controllers', ['starter.services', 'ionic-ratings'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {
	
	// INFORMACION DE USUARIO
	$http.get('http://kaerzas.pythonanywhere.com/usuarios/dameUsuario/', {
		headers: {
			'Authorization': 'Token ' + window.localStorage.getItem("token")
		}
	})
	.success(function(data) {
		$scope.usuario = data.user;
		$scope.nombre = data.serializer.username;
		$scope.imagen = data.serializer.imagen;
	})

})

.controller('inicioCtrl', function($scope, $http, sharedToken) {

	//window.localStorage.setItem("puntuacion",undefined);
	
	var onSuccess = function(position) {
		$scope.latitude=position.coords.latitude;

		$scope.longitude=position.coords.longitude;

		var p ={
				"latitud":$scope.latitude,
				"longitud":$scope.longitude,
		}

		console.log(sharedToken.getProperty());

		$http({method: 'GET', url: 'http://kaerzas.pythonanywhere.com/tapas/listaTapas/', params: {latitud:$scope.latitude, longitud:$scope.longitude, rango:$scope.user.value},headers: {
			'Authorization': 'Token ' + window.localStorage.getItem("token")}
		})
		.success(function(data) {
			$scope.greeting = data.serializer;
			$scope.usuario = data.user;
		})
		.error(function(error) {
			console.log(error);
		})		
		.finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});

	};

	$scope.doRefresh = function(){
		navigator.geolocation.getCurrentPosition(onSuccess, onError)


	}

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


})

.controller('PhotoController', function($scope, $cordovaCamera, $ionicActionSheet) {
	//Acción para tomar foto desde cámara
	$scope.takePhoto = function () {
		var options = {
				quality: 75,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 300,
				targetHeight: 300,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation: true //Corregir que salga la foto con rotación
		};

		$cordovaCamera.getPicture(options).then(function (imageData) {
			$scope.imgURI = "data:image/jpeg;base64," + imageData;
		}, function (err) {
			// An error occured. Show a message to the user
		});
	}
	//Acción para tomar foto desde galeria
	$scope.choosePhoto = function () {
		var options = {
				quality: 75,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 300,
				targetHeight: 300,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false
		};
		$cordovaCamera.getPicture(options).then(function (imageData) {
			$scope.imgURI = "data:image/jpeg;base64," + imageData;
			//alert($scope.imgURI);
		}, function (err) {
			// An error occured. Show a message to the user
		});
	}
	// Barra de Acciones
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
			        		  $scope.takePhoto();
			        		  return true;
			        	  case 1:
			        		  $scope.choosePhoto();
			        		  return true;
			        	  }
			          }
		})
	};
})

.controller('anyadirBarCtrl', function($scope, $http, $controller, sharedToken, $ionicPopup, $ionicActionSheet) {

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
	};
	var onFail = function(e) {
		console.log("On fail " + e);
	}
	$scope.reset = function(BarForm) {
		$scope.bar = {};
	};
	
	$scope.bar = [];

	$scope.send = function() {

		var myImg = $scope.picData;

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
				window.location = "#/app/inicio";
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
		} else {
			try {
				var options = new FileUploadOptions();
				options.fileKey="imagen";
				options.chunkedMode = false;
				options.httpMethod = "POST";
				options.headers = {'Authorization': 'Token ' + window.localStorage.getItem("token")};
				var params = {};
				params.nombre = bar.nombre;
				params.descripcion = bar.descripcion;
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

	var onUploadSuccess = function(FILE_URI) {
		window.location = "#/app/inicio";
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
	});
})

.controller('anyadirTapaCtrl', function($scope, $http) {

	$scope.update = function() {
		console.log($scope.tapa);
	};

	$scope.reset = function(TapaForm) {
		$scope.tapa = {};
	};

	$scope.guardar= function(tapa) {

		var t = {
				"nombre": tapa.nombre,
				"imagen": null,
				"descripcion": tapa.descripcion,
				"fechaSubida": new Date(),//Fecha actual
				"bar": tapa.bar,
				"usuarioRegistro": 2//Prueba
		}
		$http.post('http://kaerzas.pythonanywhere.com/tapas/anyadirTapa/', t);
	};
})  

.controller('seleccionarBarCtrl', function($scope) {

}) 

.controller('anyadirBarPorTapaCtrl', function($scope) {

})



.controller('detalleTapaCtrl', function($scope, $http, $stateParams, sharedToken, $state, $cordovaInAppBrowser) {
	
	var v = $stateParams.id;
	
	
	// INFORMACION DE USUARIO
	$http.get('http://kaerzas.pythonanywhere.com/usuarios/dameUsuario/', {
		headers: {
			'Authorization': 'Token ' + window.localStorage.getItem("token")
		}
	})
	.success(function(data) {
		$scope.nombreUsuario = data.serializer.username;
	})
	
	var getTapa = function() {

		$http.get('http://kaerzas.pythonanywhere.com/tapas/detalleTapa/' + v + '/', {
			cache: false,
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

			//para cargar los parametros del mapa
			$scope.centro=[$scope.bar.latitud, $scope.bar.longitud];
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
		.success(function(data) {
			window.location = "#/app/inicio";
			//window.reload();
		})
	};

	// METODO VALORACION	
	$scope.ratingsObject = {
			iconOn : 'ion-ios-star',
			iconOff : 'ion-ios-star-outline',
			iconOnColor: 'rgb(200, 200, 100)',
			iconOffColor:  'rgb(200, 100, 100)',
			rating:window.localStorage.getItem("puntuacion"),
			minRating:1,
			callback: function(rating) {
				$scope.ratingsCallback(rating)
			}
	}

	$scope.ratingsCallback = function(rating) {
		var val = {				
				"puntuacion": rating,     
				"tapa": v,
				"usuario": $scope.usuario
		}
		
		console.log(val)

		$http.post('http://kaerzas.pythonanywhere.com/tapas/anyadirValoracion/', val, {
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})	
		.success(function(data) {
			window.location = "#/app/inicio";
		})
		.error(function(error) {
			console.log(error);
		})
	};

	/*
	$scope.updateValoracion = function() {
		console.log($scope.valoracion);
	};

	$scope.resetValoracion = function(valoracionForm) {
		$scope.valoracion = {};
	};

	$scope.guardarValoracion= function(valoracion) {

		var val = {				
				"puntuacion": valoracion,     
				"tapa": v,
				"usuario": $scope.usuario
		}

		console.log(val)

		$http.post('http://kaerzas.pythonanywhere.com/tapas/anyadirValoracion/', val, {
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})	
		.success(function(data) {
			window.location = "#/app/inicio";
		})
	};

	 */	

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
			window.location = "#/app/inicio";
			//window.reload();
		})
	};
	
	$scope.doRefresh = function(){
		getTapa();
	};

})
.controller('listaBaresCtrl', function($scope, $http, sharedToken, $timeout, $ionicFilterBar, $window) {

	//LISTAR BARES
	var getBares = function() {

		$http.get('http://kaerzas.pythonanywhere.com/tapas/listaBares/', {
			headers: {
				'Authorization': 'Token ' + window.localStorage.getItem("token")
			}
		})
		.success(function(data) {
			console.log("funciona");
			$scope.items = data;
		})
		.error(function(data){
			console.log("no funciona");
		})
		.finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	getBares();

	//LISTAR BARES POR FILTRO
	var filterBarInstance;

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
	
	$scope.doRefresh = function(){
		getBares();
	};

	//LEER QR
	$scope.scan = function() {
		console.log("escaneando...")
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
		.success(function(data) {
			sharedToken.setProperty(data.token);
			window.localStorage.setItem("token",data.token);
			//console.log("local :" + window.localStorage.getItem("token"));
			//console.log("shared :" + sharedToken.getProperty());
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