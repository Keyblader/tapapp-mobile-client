function Hello($scope, $http) {
    $http.get('http://kaerzas.pythonanywhere.com/tapas/listaTapas/').
        success(function(data) {
            $scope.greeting = data;
        });
}