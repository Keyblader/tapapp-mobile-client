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

.controller('detalleTapa', function($scope, $http) {
	$http.get('http://kaerzas.pythonanywhere.com/tapas/detalleTapa/1/').
    success(function(data) {
        $scope.greeting = data;
    })
}) 
