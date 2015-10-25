angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

// PROPIOS //
.controller('inicioCtrl', function($scope, $http) {

	$http({method: 'GET', url: 'http://localhost:8001/tapas/listaTapas/', headers: {
	    'Authorization': 'Token 17fc7b5dae4f17dd2dfc6d9218586422cc8a79a8'}
	})
    .success(function(data) {
        $scope.greeting = data;
    })
    /*
	var data = {"username": "rafa", "password": "asd"};
	
	$http.post('http://localhost:8001/api-token-auth/', {
        'username':'rafa',
        'password':'asd',
    })
        .success(function(data) {
        $scope.greeting = data;
    })
    */
})
 
.controller('anyadirBarCtrl', function($scope, $http) {

		var onSuccess = function(position) {
				$scope.latitude=position.coords.latitude;
				$scope.longitude=position.coords.longitude;

    	};

// onError Callback receives a PositionError object
//
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
			    "fechaSubida": new Date(),//Fecha actual
			    "usuarioRegistro": 2//Prueba
		  }
		  $http.post('http://localhost:8001/tapas/anyadirBar/', b);
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
		  $http.post('http://localhost:8001/tapas/anyadirTapa/', t);
	  };
})  

.controller('seleccionarBarCtrl', function($scope) {

}) 
   
.controller('anyadirBarPorTapaCtrl', function($scope) {

})

//.controller('detalleTapa', function($scope) {

//})

.controller('detalleTapaCtrl', function($scope, $http, $stateParams) {

	var v= $stateParams.id;
	//alert(v);
	var url="http://localhost:8001/tapas/detalleTapa/";
	url=url+v+"/";
	$http.get(url).
    success(function(data) {
        $scope.greeting = data;
    })
})
