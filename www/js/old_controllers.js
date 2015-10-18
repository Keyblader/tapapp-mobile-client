angular.module('app.controllers', [])
  


  
.controller('inicioCtrl', function($scope, $http) {
	$http.get('http://kaerzas.pythonanywhere.com/tapas/listaTapas/').
    success(function(data) {
        $scope.greeting = data;
    })
})
 
.controller('anyadirBarCtrl', function($scope, $http) {
		  
	  $scope.update = function() {
	    console.log($scope.bar);
	  };
	
	  $scope.reset = function(barForm) {
	    $scope.bar = {};
	  };
	
	  $scope.guardar= function(bar) {
		  
		  var b = {
				"nombre": bar.nombre,
			    "descripcion": bar.descripcion,
			    "longitud": bar.longitud,
			    "latitud": bar.latitud,
			    "fechaSubida": new Date(),//Fecha actual
			    "usuarioRegistro": 2//Prueba
		  }
		  $http.post('http://kaerzas.pythonanywhere.com/tapas/anyadirBar/', b);
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
		  $http.post('http://kaerzas.pythonanywhere.com/tapas/anyadirTapa/', t);
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
	var url="http://kaerzas.pythonanywhere.com/tapas/detalleTapa/";
	url=url+v+"/";
	$http.get(url).
    success(function(data) {
        $scope.greeting = data;
    })
})