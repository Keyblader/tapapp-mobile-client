angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	$httpProvider.defaults.useXDomain = true;
	$stateProvider

	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('app.inicio', {
		url: '/inicio',
		views: {
			'menuContent': {
				templateUrl: 'templates/inicio.html',
				controller: 'inicioCtrl'
			}
		}
	})

	.state('app.anyadirBar', {
		url: '/anyadirBar',
		views: {
			'menuContent': {
				templateUrl: 'templates/anyadirBar.html',
				controller: 'anyadirBarCtrl'
			}
		}
	})  
	.state('app.anyadirTapa', {
		url: '/anyadirTapa',
		views: {
			'menuContent': {
				templateUrl: 'templates/anyadirTapa.html',
				controller: 'anyadirTapaCtrl'
			}
		}
	})  
	.state('app.seleccionarBar', {
		url: '/seleccionarBar',
		views: {
			'menuContent': {
				templateUrl: 'templates/seleccionarBar.html',
				controller: 'seleccionarBarCtrl'
			}
		}
	})  

	.state('app.anyadirBarPorTapa', {
		url: '/anyadirBarPorTapa',
		views: {
			'menuContent': {
				templateUrl: 'templates/anyadirBarPorTapa.html',
				controller: 'anyadirBarPorTapaCtrl'
			}
		}
	})      

	.state('app.detalleTapa', {
		url: '/detalleTapa/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/detalleTapa.html',
				controller: 'detalleTapaCtrl'
			}
		}
	})
	
	.state('app.detalleBar', {
		url: '/detalleBar/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/detalleBar.html',
				controller: 'detalleBarCtrl'
			}
		}
	}) 
	
	.state('app.listaBares', {
		url: '/listaBares',
		views: {
			'menuContent': {
				templateUrl: 'templates/listaBares.html',
				controller: 'listaBaresCtrl'
			}
		}
	}) 
	
	.state('registrarUsuario', {
		url: '/registrarUsuario',
		templateUrl: 'templates/registrarUsuario.html',
		controller: 'registrarUsuarioCtrl'
	}) 
	
	.state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'loginCtrl'
	}) 
		
	;
	
	// si se introduce una url diferente
	$urlRouterProvider.otherwise('/login');
});
