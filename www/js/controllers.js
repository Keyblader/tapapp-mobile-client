angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
	
})

.controller('inicioCtrl', function($scope, $http, sharedToken) {

	var onSuccess = function(position) {
		
		$scope.doRefresh = function() {
			$scope.latitude=position.coords.latitude;

			$scope.longitude=position.coords.longitude;

			var p ={
					"latitud":$scope.latitude,
					"longitud":$scope.longitude,
			}

			
			$http({method: 'GET', url: 'http://localhost:8000/tapas/listaTapas/', params: {latitud:$scope.latitude, longitud:$scope.longitude},headers: {
				'Authorization': 'Token ' + sharedToken.getProperty()}
			})
			.success(function(data) {
				$scope.greeting = data.serializer;
				$scope.usuario = data.user;
			})
			.finally(function() {
			       // Stop the ion-refresher from spinning
			       $scope.$broadcast('scroll.refreshComplete');
			});
		}
	};

//	onError Callback receives a PositionError object

	function onError(error) {
		alert('code: '    + error.code    + '\n' +
				'message: ' + error.message + '\n');
	};

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

.controller('anyadirBarCtrl', function($scope, $http, $controller, sharedToken) {

	$controller('PhotoController', {$scope: $scope});//Usar un controlador desde otro controlador
	$scope.bar = {}

	$http.get('http://localhost:8000/usuarios/dameUsuario/', {
		  headers: {
			  'Authorization': 'Token ' + sharedToken.getProperty()
		  }
	})
	.success(function(data) {
		$scope.usuario = data.user;
	})
	
	//función que se ejecuta al obtener la posición con getCurrentPosition si no hay error
	var onSuccess = function(position) {
		$scope.latitude=position.coords.latitude;
		$scope.longitude=position.coords.longitude;

		//para cargar los parametros del mapa
		var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var mapSettings = {
				center: latlng,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		//para crear el mapa y dibujarlo en el div
		var map = new google.maps.Map(document.getElementById('mapa'), mapSettings);

		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			draggable: false,
			title: 'Arrastrame'
		});
	};

//	onError Callback receives a PositionError object

	function onError(error) {
		alert('code: '    + error.code    + '\n' +
				'message: ' + error.message + '\n');
	};

	navigator.geolocation.getCurrentPosition(onSuccess, onError);		

	$scope.update = function() {
		console.log($scope.bar);
	};

	$scope.reset = function(barForm) {
		$scope.bar = {};
	};

	$scope.guardar= function (bar) {


		var b = {
				"nombre": bar.nombre,
				"descripcion": bar.descripcion,
				"longitud": $scope.longitude,
				"latitud": $scope.latitude,
				"imagen" : $scope.imgURI,
				"fechaSubida": new Date(),//Fecha actual
				"usuarioRegistro": $scope.usuario
		}

		$http.post('http://localhost:8000/tapas/anyadirBar/', b, {
			headers: {
				'Authorization': 'Token ' + sharedToken.getProperty()
			}
		})
		.success(function(data) {
			window.location = "#/app/inicio";
		})
	};
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
		$http.post('http://localhost:8000/tapas/anyadirTapa/', t);
	};
})  

.controller('seleccionarBarCtrl', function($scope) {

}) 

.controller('anyadirBarPorTapaCtrl', function($scope) {

})



.controller('detalleTapaCtrl', function($scope, $http, $stateParams, sharedToken, $state) {

	
	var v = $stateParams.id;
	
	$http.get('http://localhost:8000/tapas/detalleTapa/' + v + '/', {
		  headers: {
			  'Authorization': 'Token ' + sharedToken.getProperty()
		  }
	})
	.success(function(data) {
		$scope.tapa = data.tapa;
		$scope.usuario = data.user;
		$scope.bar = data.bar;
		$scope.comentarios = data.comentarios;
		$scope.fotos = data.fotos.concat(data.tapa);
		$scope.usuarioRegistro = data.usuarioRegistro;
	})
	
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
			    "usuario": $scope.usuario
		}
		
		console.log(c)
		
		$http.post('http://localhost:8000/tapas/anyadirComentario/', c, {
			  headers: {
				  'Authorization': 'Token ' + sharedToken.getProperty()
			  }
		})	
		.success(function(data) {
			window.location = "#/app/inicio";
		})
	};
	
	// METODO VALORACION

	$scope.updateValoracion = function() {
		console.log($scope.valoracion);
	};

	$scope.resetValoracion = function(valoracionForm) {
		$scope.valoracion = {};
	};
	
	$scope.guardarValoracion= function(valoracion) {

		var val = {				
			    "puntuacion": valoracion.puntuacion,     
			    "tapa": v,
			    "usuario": $scope.usuario
		}
		
		console.log(val)
		
		$http.post('http://localhost:8000/tapas/anyadirValoracion/', val, {
			  headers: {
				  'Authorization': 'Token ' + sharedToken.getProperty()
			  }
		})	
		.success(function(data) {
			window.location = "#/app/inicio";
		})
	};
	
		
})

.controller('detalleBarCtrl', function($scope, $http, $stateParams, sharedToken) {

	
	var v = $stateParams.id;
	
	$http.get('http://localhost:8000/tapas/detalleBar/' + v + '/', {
		  headers: {
			  'Authorization': 'Token ' + sharedToken.getProperty()
		  }
	})
	.success(function(data) {
		$scope.tapas = data.tapas;
		$scope.bar = data.bar;
	})
})

.controller('registrarUsuarioCtrl', function($scope, $http) {

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
		$http.post('http://localhost:8000/usuarios/anyadirUsuario/', u)		
		.success(function(data) {
			window.location = "#/app/inicio";
		})
	};
})

.controller('loginCtrl', function($scope, $http, sharedToken) {

	$scope.update = function() {
		console.log($scope.user);
	};

	$scope.reset = function(UserForm) {
		$scope.user = {};
	};

	$scope.guardar= function(user) {
		$http.post('http://localhost:8000/api-token-auth/', 'username=' + user.username + '&password=' + user.password, {
			  headers: {
			    'Content-Type': 'application/x-www-form-urlencoded'
			  }
		})
	    .success(function(data) {
	    	sharedToken.setProperty(data.token);
	        //console.log(sharedToken.getProperty())
	    	window.location = "#/app/inicio";
	    })
	};
})