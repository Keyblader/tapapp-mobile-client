angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('inicioCtrl', function($scope, $http) {
	$http.get('http:127.0.1:8001/tapas/listaTapas/').
	success(function(data) {
		$scope.greeting = data;
	})
})

.controller('anyadirBarCtrl', function($scope, $http) {

	var onSuccess = function(position) {
		$scope.latitude=position.coords.latitude;
		$scope.longitude=position.coords.longitude;
	};

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
		$http.post('http:127.0.1:8001/tapas/anyadirBar/', b);
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
		$http.post('http:127.0.1:8001/tapas/anyadirTapa/', t);
	};
})  

.controller('seleccionarBarCtrl', function($scope) {

}) 

.controller('anyadirBarPorTapaCtrl', function($scope) {

})

.controller('detalleTapaCtrl', function($scope, $http, $stateParams) {
	var v= $stateParams.id;
	//alert(v);
	var url="http:127.0.1:8001/tapas/detalleTapa/";
	url=url+v+"/";
	$http.get(url).
	success(function(data) {
		$scope.greeting = data;
	})
})


.controller('loginCtrl', function ($scope, $location, djangoAuth, Validate) {
	$scope.model = {'username':'','password':''};
	$scope.complete = false;
	$scope.login = function(formData){
		$scope.errors = [];
		Validate.form_validation(formData,$scope.errors);
		if(!formData.$invalid){
			djangoAuth.login($scope.model.username, $scope.model.password)
			.then(function(data){
				// success case
				$location.path("/inicio");
			},function(data){
				// error case
				$scope.errors = data;
			});
		}
	}
})


.controller('registerCtrl', function ($scope, djangoAuth, Validate) {
	$scope.model = {'username':'','password':'','email':''};
	$scope.complete = false;
	$scope.register = function(formData){
		$scope.errors = [];
		Validate.form_validation(formData,$scope.errors);
		if(!formData.$invalid){
			djangoAuth.register($scope.model.username,$scope.model.password1,$scope.model.password2,$scope.model.email)
			.then(function(data){
				// success case
				$scope.complete = true;
			},function(data){
				// error case
				$scope.errors = data;
			});
		}
	}
})
