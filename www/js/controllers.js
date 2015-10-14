var app = angular.module('TapApp', []);

app.controller('Hello', function($scope, $http) {
	$http.get('http://kaerzas.pythonanywhere.com/tapas/listaTapas/').
    success(function(data) {
        $scope.greeting = data;
    });
});
