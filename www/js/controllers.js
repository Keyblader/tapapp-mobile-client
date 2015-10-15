angular.module('app.controllers', [])
  


  
.controller('inicioCtrl', function($scope, $http) {
	$http.get('http://kaerzas.pythonanywhere.com/tapas/listaTapas/').
    success(function(data) {
        $scope.greeting = data;
    })
})
 
.controller('anyadirBarCtrl', function($scope) {

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